import Notebook from "@/components/mid/Notebook"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Jupyter-Next</h1>
          <Notebook />
        </div>
      </main>
    </ThemeProvider>
  )
}
