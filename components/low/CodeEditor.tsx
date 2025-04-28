"use client"

import { useRef, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"

interface CodeEditorProps {
    value: string
    onChange: (value: string) => void
    language?: string
    height?: string
}

const CodeEditor = ({ value, onChange, language = "python", height = "100px" }: CodeEditorProps) => {
    const { theme } = useTheme()
    const editorRef = useRef<any>(null)

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor
        editor.focus()

        // Update editor layout when height changes
        if (editor && height) {
            editor.layout()
        }
    }

    // Update layout when height changes
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.layout()
        }
    }, [height])

    return (
        <div className="w-full pt-1">
            <Editor
                height={height}
                language={language}
                value={value}
                theme={theme === "dark" ? "vs-dark" : "light"}
                onChange={(value) => onChange(value || "")}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 17,
                    tabSize: 5,
                    automaticLayout: true,
                    wordWrap: "on",
                    lineNumbers: "off",
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    renderLineHighlight: "none",
                    scrollbar: {
                        vertical: "hidden",
                        horizontal: "hidden",
                    },
                }}
            />
        </div>
    )
}

export default CodeEditor