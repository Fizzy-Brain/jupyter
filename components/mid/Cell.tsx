"use client"

import { useEffect, useRef, useState } from "react"
import CodeEditor from "@/components/low/CodeEditor"
import OutputRenderer from "@/components/low/OutputRenderer"
import CellControls from "./CellControls"
import type { Cell as CellType } from "@/lib/types"
import { useCellStore } from "@/lib/store"
import { executeCode } from "@/lib/executor"
import { cn } from "@/lib/utils"

interface CellProps {
  cell: CellType
  isLast: boolean
  index: number
}

const Cell = ({ cell, isLast, index }: CellProps) => {
  const dispatch = useCellStore((state) => state.dispatch)
  const [isHovered, setIsHovered] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState("auto")

  const handleCodeChange = (code: string) => {
    dispatch({ type: "UPDATE_CELL", id: cell.id, code })
  }

  const handleRunCell = async () => {
    dispatch({ type: "RUN_CELL", id: cell.id })
  }

  const handleClearCell = () => {
    dispatch({ type: "UPDATE_CELL", id: cell.id, code: "" })
    dispatch({ type: "SET_OUTPUT", id: cell.id, output: "", error: undefined })
  }

  // Calculate editor height based on content
  useEffect(() => {
    if (editorRef.current) {
      // Set minimum height and allow it to grow
      const lineCount = (cell.code.match(/\n/g) || []).length + 1
      const newHeight = Math.max(1, lineCount) * 22 + 16 // 22px per line + padding
      setEditorHeight(`${newHeight}px`)
    }
  }, [cell.code])

  return (
      <div
          className={cn(
              "mb-4 relative group bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden",
              isHovered ? "ring-1 ring-primary/30" : "",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={editorRef}
      >
        <div className="flex items-stretch">
          {/* Left sidebar with execution indicator */}
          <div className="w-12 flex-shrink-0 bg-blue-500 flex items-center justify-center text-white">
            <div className="text-xs font-mono">[{cell.isExecuting ? "*" : " "}]:</div>
          </div>

          {/* Main content area */}
          <div className="flex-grow">
            <CodeEditor value={cell.code} onChange={handleCodeChange} height={editorHeight} />
          </div>

          {/* Right controls */}
          <div className={cn("absolute right-2 top-2 flex items-center gap-1", isHovered ? "opacity-100" : "opacity-0")}>
            <CellControls
                cellId={cell.id}
                isExecuting={cell.isExecuting}
                onRun={handleRunCell}
                onClear={handleClearCell}
                isLast={isLast}
                index={index}
            />
          </div>
        </div>

        {(cell.output || cell.error) && (
            <div className="border-t border-gray-200 dark:border-gray-800">
              <OutputRenderer output={cell.output} error={cell.error} />
            </div>
        )}
      </div>
  )
}

export default Cell
