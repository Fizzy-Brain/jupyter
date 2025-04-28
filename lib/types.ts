export interface Cell {
  id: string
  code: string
  output: string
  isExecuting: boolean
  error?: string
}

export type CellAction =
    | { type: "ADD_CELL"; position: "above" | "below"; id?: string }
    | { type: "DELETE_CELL"; id: string }
    | { type: "UPDATE_CELL"; id: string; code: string }
    | { type: "SET_OUTPUT"; id: string; output: string; error?: string }
    | { type: "SET_EXECUTING"; id: string; isExecuting: boolean }
    | { type: "CLEAR_ALL_CELLS" }
    | { type: "DELETE_CELLS_ABOVE"; id: string }
    | { type: "DELETE_CELLS_BELOW"; id: string }
    | { type: "RUN_CELL"; id: string }
    | { type: "RUN_ALL_CELLS" }
    | { type: "RUN_CELLS_ABOVE"; id: string }
    | { type: "RUN_CELLS_BELOW"; id: string }
    | { type: "CLEAR_CELL_OUTPUT"; id: string }

export interface NotebookFile {
  cells: {
    id: string
    code: string
    output: string
  }[]
}
