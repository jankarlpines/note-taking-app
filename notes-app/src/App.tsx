import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import notesData from './data/notes.json'
import { Note } from './types'
import { ThemeProvider } from "./components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : notesData.notes
  })
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const createNewNote = () => {
    const newNote: Note = {
      id: String(Date.now()),
      title: "New Note",
      content: "",
      createdAt: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  return (
    <ThemeProvider defaultTheme="system">
      <SidebarProvider>
        <div className="grid h-screen">
          {/* Mobile view */}
          <div className="md:hidden">
            {/* Add mobile layout here if needed */}
          </div>
          {/* Desktop view */}
          <div className="hidden md:block">
            <div className="border-t">
              <div className="bg-background">
                <div className="grid lg:grid-cols-5">
                  <div className={`${isCollapsed ? 'lg:col-span-1' : 'lg:col-span-1'} hidden lg:block`}>
                    <Sidebar
                      notes={notes}
                      selectedNote={selectedNote}
                      onSelectNote={setSelectedNote}
                      onNewNote={createNewNote}
                      isCollapsed={isCollapsed}
                      onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                  </div>
                  <div className="col-span-3 lg:col-span-4 lg:border-l">
                    <div className="h-full px-4 py-6 lg:px-8">
                      <Editor
                        note={selectedNote}
                        onUpdateNote={(updatedNote) => {
                          setNotes(notes.map(note => 
                            note.id === updatedNote.id ? updatedNote : note
                          ))
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App