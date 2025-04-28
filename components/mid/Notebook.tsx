"use client"

import { useState, useEffect } from "react"
import Cell from "./Cell"
import NotebookControls from "./NotebookControls"
import { useCellStore } from "@/lib/store"

const Notebook = () => {
    const cells = useCellStore((state) => state.cells)
    const [currentCellId, setCurrentCellId] = useState<string | undefined>(cells.length > 0 ? cells[0].id : undefined)

    // Update current cell when cells change
    useEffect(() => {
        if (cells.length > 0 && !cells.some((cell) => cell.id === currentCellId)) {
            setCurrentCellId(cells[0].id)
        }
    }, [cells, currentCellId])

    return (
        <div className="notebook">
            <NotebookControls cells={cells} currentCellId={currentCellId} />

            <div className="cells-container">
                {cells.map((cell, index) => (
                    <div key={cell.id} onClick={() => setCurrentCellId(cell.id)} className="cursor-text">
                        <Cell cell={cell} isLast={index === cells.length - 1} index={index + 1} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notebook
