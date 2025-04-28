"use client"

import { Play, Trash2, Save, FileDown, ChevronUp, ChevronDown, Code } from "lucide-react"
import Button from "@/components/low/Button"
import ThemeToggle from "@/components/low/ThemeToggle"
import { useCellStore } from "@/lib/store"
import { downloadNotebook } from "@/lib/saver"
import type { Cell } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NotebookControlsProps {
  cells: Cell[]
  currentCellId?: string
}

const NotebookControls = ({ cells, currentCellId }: NotebookControlsProps) => {
  const dispatch = useCellStore((state) => state.dispatch)

  const handleRunAll = () => {
    dispatch({ type: "RUN_ALL_CELLS" })
  }

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_ALL_CELLS" })
  }

  const handleRunAbove = () => {
    if (currentCellId) {
      dispatch({ type: "RUN_CELLS_ABOVE", id: currentCellId })
    }
  }

  const handleRunBelow = () => {
    if (currentCellId) {
      dispatch({ type: "RUN_CELLS_BELOW", id: currentCellId })
    }
  }

  const handleDeleteAbove = () => {
    if (currentCellId) {
      dispatch({ type: "DELETE_CELLS_ABOVE", id: currentCellId })
    }
  }

  const handleDeleteBelow = () => {
    if (currentCellId) {
      dispatch({ type: "DELETE_CELLS_BELOW", id: currentCellId })
    }
  }

  const handleDownload = (format: "ipynb" | "py") => {
    downloadNotebook(cells, format)
  }

  return (
    <div className="flex items-center gap-2 mb-6 p-2 bg-background border rounded-md shadow-sm">
      <Button onClick={handleRunAll} size="sm" className="flex items-center gap-1">
        <Play className="h-4 w-4" />
        Run All
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleRunAll}>
            <Play className="h-4 w-4 mr-2" />
            Run All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRunAbove} disabled={!currentCellId}>
            <ChevronUp className="h-4 w-4 mr-2" />
            Run Above
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRunBelow} disabled={!currentCellId}>
            <ChevronDown className="h-4 w-4 mr-2" />
            Run Below
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteAbove} disabled={!currentCellId}>
            <ChevronUp className="h-4 w-4 mr-2" />
            Delete Above
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteBelow} disabled={!currentCellId}>
            <ChevronDown className="h-4 w-4 mr-2" />
            Delete Below
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleDownload("ipynb")}>
            <FileDown className="h-4 w-4 mr-2" />
            Download as .ipynb
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload("py")}>
            <Code className="h-4 w-4 mr-2" />
            Download as .py
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  )
}

export default NotebookControls
