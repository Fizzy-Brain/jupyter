"use client"

import { Play, Trash2, ChevronUp, ChevronDown, Copy, Eraser } from "lucide-react"
import Button from "@/components/low/Button"
import { useCellStore } from "@/lib/store"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface CellControlsProps {
  cellId: string
  isExecuting: boolean
  onRun: () => void
  onClear: () => void
  isLast: boolean
  index: number
}

const CellControls = ({ cellId, isExecuting, onRun, onClear, isLast, index }: CellControlsProps) => {
  const dispatch = useCellStore((state) => state.dispatch)

  const handleAddCell = (position: "above" | "below") => {
    dispatch({ type: "ADD_CELL", position, id: cellId })
  }

  const handleDeleteCell = () => {
    dispatch({ type: "DELETE_CELL", id: cellId })
  }

  const handleCopyCell = () => {
    const cells = useCellStore.getState().cells
    const cell = cells.find((c) => c.id === cellId)
    if (cell && cell.code) {
      navigator.clipboard.writeText(cell.code)
    }
  }

  return (
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={handleCopyCell} aria-label="Copy cell">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleAddCell("above")} aria-label="Add cell above">
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add cell above</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleAddCell("below")} aria-label="Add cell below">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add cell below</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={onRun} isLoading={isExecuting} aria-label="Run cell">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run cell</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear cell">
                  <Eraser className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear cell</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="ghost" size="icon" onClick={handleDeleteCell} aria-label="Delete cell">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete cell</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
  )
}

export default CellControls
