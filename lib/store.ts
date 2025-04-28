import { create } from "zustand"
import type { Cell, CellAction } from "./types"
import { v4 as uuidv4 } from "uuid"
import { executeCode, resetSession } from "./executor"

interface CellStore {
  cells: Cell[]
  dispatch: (action: CellAction) => void
}

export const useCellStore = create<CellStore>((set, get) => ({
  cells: [{ id: uuidv4(), code: "", output: "", isExecuting: false }],

  dispatch: async (action) => {
    switch (action.type) {
      case "ADD_CELL": {
        const { cells } = get()
        const newCell: Cell = { id: uuidv4(), code: "", output: "", isExecuting: false }

        if (!action.id) {
          // Add to the end if no id is provided
          set({ cells: [...cells, newCell] })
          return
        }

        const index = cells.findIndex((cell) => cell.id === action.id)
        if (index === -1) return

        const newIndex = action.position === "above" ? index : index + 1
        const newCells = [...cells.slice(0, newIndex), newCell, ...cells.slice(newIndex)]

        set({ cells: newCells })
        break
      }

      case "DELETE_CELL": {
        const { cells } = get()
        const newCells = cells.filter((cell) => cell.id !== action.id)

        // Always keep at least one cell
        if (newCells.length === 0) {
          newCells.push({ id: uuidv4(), code: "", output: "", isExecuting: false })
        }

        set({ cells: newCells })
        break
      }

      case "UPDATE_CELL": {
        const { cells } = get()
        const newCells = cells.map((cell) => (cell.id === action.id ? { ...cell, code: action.code } : cell))

        set({ cells: newCells })
        break
      }

      case "SET_OUTPUT": {
        const { cells } = get()
        const newCells = cells.map((cell) =>
            cell.id === action.id ? { ...cell, output: action.output, error: action.error, isExecuting: false } : cell,
        )

        set({ cells: newCells })
        break
      }

      case "SET_EXECUTING": {
        const { cells } = get()
        const newCells = cells.map((cell) =>
            cell.id === action.id ? { ...cell, isExecuting: action.isExecuting } : cell,
        )

        set({ cells: newCells })
        break
      }

      case "CLEAR_ALL_CELLS": {
        // Reset the Python session when clearing all cells
        resetSession()

        set({
          cells: [{ id: uuidv4(), code: "", output: "", isExecuting: false }],
        })
        break
      }

      case "DELETE_CELLS_ABOVE": {
        const { cells } = get()
        const index = cells.findIndex((cell) => cell.id === action.id)
        if (index <= 0) return

        // When deleting cells above, we need to re-run all remaining cells to maintain state
        const remainingCells = [...cells.slice(index)]
        set({ cells: remainingCells })

        // Re-run all cells to rebuild the session state
        const { dispatch } = get()
        dispatch({ type: "RUN_ALL_CELLS" })
        break
      }

      case "DELETE_CELLS_BELOW": {
        const { cells } = get()
        const index = cells.findIndex((cell) => cell.id === action.id)
        if (index === -1 || index === cells.length - 1) return

        const newCells = [...cells.slice(0, index + 1)]
        set({ cells: newCells })
        break
      }

      case "RUN_CELL": {
        const { cells } = get()
        const { dispatch } = get()
        const cell = cells.find((c) => c.id === action.id)
        if (!cell) return

        dispatch({ type: "SET_EXECUTING", id: cell.id, isExecuting: true })

        try {
          // Run only the current cell's code
          const output = await executeCode(cell.code, cell.id)
          dispatch({ type: "SET_OUTPUT", id: cell.id, output })
        } catch (error) {
          dispatch({
            type: "SET_OUTPUT",
            id: cell.id,
            output: "",
            error: error instanceof Error ? error.message : String(error),
          })
        }
        break
      }

      case "RUN_ALL_CELLS": {
        const { cells } = get()
        const { dispatch } = get()

        // Reset session before running all cells
        resetSession()

        // Run cells sequentially
        for (const cell of cells) {
          dispatch({ type: "SET_EXECUTING", id: cell.id, isExecuting: true })
          try {
            const output = await executeCode(cell.code, cell.id)
            dispatch({ type: "SET_OUTPUT", id: cell.id, output })
          } catch (error) {
            dispatch({
              type: "SET_OUTPUT",
              id: cell.id,
              output: "",
              error: error instanceof Error ? error.message : String(error),
            })
            // Stop execution on error
            break
          }
        }
        break
      }

      case "RUN_CELLS_ABOVE": {
        const { cells } = get()
        const { dispatch } = get()
        const index = cells.findIndex((cell) => cell.id === action.id)
        if (index === -1) return

        // Reset session before running cells
        resetSession()

        // Run cells above sequentially
        for (let i = 0; i < index; i++) {
          const cell = cells[i]
          dispatch({ type: "SET_EXECUTING", id: cell.id, isExecuting: true })
          try {
            const output = await executeCode(cell.code, cell.id)
            dispatch({ type: "SET_OUTPUT", id: cell.id, output })
          } catch (error) {
            dispatch({
              type: "SET_OUTPUT",
              id: cell.id,
              output: "",
              error: error instanceof Error ? error.message : String(error),
            })
            // Stop execution on error
            break
          }
        }
        break
      }

      case "RUN_CELLS_BELOW": {
        const { cells } = get()
        const { dispatch } = get()
        const index = cells.findIndex((cell) => cell.id === action.id)
        if (index === -1) return

        // We need to run all cells up to and including the current one first
        // to ensure proper state, then run the ones below

        // First run all cells up to current
        for (let i = 0; i <= index; i++) {
          const cell = cells[i]
          dispatch({ type: "SET_EXECUTING", id: cell.id, isExecuting: true })
          try {
            const output = await executeCode(cell.code, cell.id)
            dispatch({ type: "SET_OUTPUT", id: cell.id, output })
          } catch (error) {
            dispatch({
              type: "SET_OUTPUT",
              id: cell.id,
              output: "",
              error: error instanceof Error ? error.message : String(error),
            })
            // Stop execution on error
            return
          }
        }

        // Then run cells below
        for (let i = index + 1; i < cells.length; i++) {
          const cell = cells[i]
          dispatch({ type: "SET_EXECUTING", id: cell.id, isExecuting: true })
          try {
            const output = await executeCode(cell.code, cell.id)
            dispatch({ type: "SET_OUTPUT", id: cell.id, output })
          } catch (error) {
            dispatch({
              type: "SET_OUTPUT",
              id: cell.id,
              output: "",
              error: error instanceof Error ? error.message : String(error),
            })
            // Stop execution on error
            break
          }
        }
        break
      }

      case "CLEAR_CELL_OUTPUT": {
        const { cells } = get()
        const newCells = cells.map((cell) => (cell.id === action.id ? { ...cell, output: "", error: undefined } : cell))
        set({ cells: newCells })
        break
      }
    }
  },
}))
