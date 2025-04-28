import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { content, format } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    // Generate a unique filename
    const fileName = `notebook_${uuidv4()}.${format}`
    const filePath = join("/tmp", fileName)

    // Write the content to a file
    await writeFile(filePath, content)

    return NextResponse.json({
      success: true,
      fileName,
      filePath,
    })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
