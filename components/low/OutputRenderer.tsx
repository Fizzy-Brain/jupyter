"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OutputRendererProps {
  output: string
  error?: string
  className?: string
}

const OutputRenderer = ({ output, error, className }: OutputRendererProps) => {
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output, error])

  if (!output && !error) {
    return null
  }

  return (
    <div
      className={cn(
        "p-4 mt-2 rounded-md font-mono text-sm overflow-auto max-h-[300px]",
        error
          ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800"
          : "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        className,
      )}
      ref={outputRef}
    >
      {error ? <pre className="whitespace-pre-wrap">{error}</pre> : <pre className="whitespace-pre-wrap">{output}</pre>}
    </div>
  )
}

export default OutputRenderer
