import { v4 as uuidv4 } from "uuid"

// Store the session ID for the notebook
let notebookSessionId = uuidv4()

// Store the last executed cell ID to maintain state
let lastExecutedCellId: string | null = null

export const executeCode = async (code: string, cellId: string): Promise<string> => {
  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        sessionId: notebookSessionId,
        cellId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to execute code")
    }

    const data = await response.json()
    lastExecutedCellId = cellId
    return data.output
  } catch (error) {
    console.error("Error executing code:", error)
    throw error
  }
}

// Reset the session (for when all cells are cleared)
export const resetSession = () => {
  notebookSessionId = uuidv4()
  lastExecutedCellId = null
}

// Get the current session ID
export const getSessionId = () => notebookSessionId

// Get the last executed cell ID
export const getLastExecutedCellId = () => lastExecutedCellId
