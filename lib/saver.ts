import type { Cell, NotebookFile } from "./types"

export const saveAsNotebook = (cells: Cell[]): NotebookFile => {
  return {
    cells: cells.map((cell) => ({
      id: cell.id,
      code: cell.code,
      output: cell.output,
    })),
  }
}

export const saveAsPythonScript = (cells: Cell[]): string => {
  return cells
    .map((cell) => {
      // Add comments for cell separation
      return `# Cell ${cell.id}\n${cell.code}\n\n`
    })
    .join("")
}

export const downloadNotebook = (cells: Cell[], format: "ipynb" | "py") => {
  let content: string
  let filename: string
  let mimeType: string

  if (format === "ipynb") {
    const notebookData = saveAsNotebook(cells)
    content = JSON.stringify(notebookData, null, 2)
    filename = "notebook.ipynb"
    mimeType = "application/json"
  } else {
    content = saveAsPythonScript(cells)
    filename = "notebook.py"
    mimeType = "text/plain"
  }

  // Create a blob and download it
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  // Clean up
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
