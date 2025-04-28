import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { writeFile, readFile, mkdir, access } from "fs/promises"
import { join } from "path"
import { constants } from "fs"

const execPromise = promisify(exec)

// Path to store session files
const SESSION_DIR = join("/tmp", "jupyter-next-sessions")

// Ensure session directory exists
async function ensureSessionDir() {
  try {
    await access(SESSION_DIR, constants.F_OK)
  } catch {
    await mkdir(SESSION_DIR, { recursive: true })
  }
}

// Get or create a session file for a notebook
async function getSessionFile(sessionId: string) {
  await ensureSessionDir()
  const sessionPath = join(SESSION_DIR, `${sessionId}.py`)

  try {
    await access(sessionPath, constants.F_OK)
  } catch {
    // Create a new session file if it doesn't exist
    await writeFile(sessionPath, "# Jupyter-Next Session\n")
  }

  return sessionPath
}

export async function POST(request: Request) {
  try {
    const { code, sessionId = "default", cellId } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    // Get the session file path
    const sessionPath = await getSessionFile(sessionId)

    // Read existing session code
    const existingCode = await readFile(sessionPath, "utf-8")

    // Create a temporary file for this execution
    const tempFilePath = join(SESSION_DIR, `${sessionId}_temp.py`)

    try {
      // Write the combined code to the temp file
      // This includes all previously executed code plus the new cell code
      await writeFile(tempFilePath, existingCode + "\n\n# Cell execution\n" + code)

      // Execute the Python code with a custom environment to capture output
      const { stdout, stderr } = await execPromise(
        `python -c "import sys; from io import StringIO; import contextlib; ` +
        `sys.stdout = StringIO(); sys.stderr = StringIO(); ` +
        `with open('${tempFilePath.replace(/\\/g, '/')}', 'r') as f: ` +
        `    exec(f.read(), globals()); ` +
        `print(sys.stdout.getvalue(), end=''); ` +
        `print(sys.stderr.getvalue(), end='', file=sys.stderr)"`
      )

      // If execution was successful, append this cell's code to the session file
      if (!stderr) {
        await writeFile(sessionPath, existingCode + "\n\n# Cell " + cellId + "\n" + code)
      }

      // Return the output
      if (stderr) {
        return NextResponse.json({ error: stderr }, { status: 400 })
      }

      return NextResponse.json({ output: stdout })
    } catch (error) {
      console.error("Execution error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error occurred" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Request error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
