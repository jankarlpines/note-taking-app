import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import notesData from './data/notes.json'
import { Note } from './types'
import { ThemeProvider } from "./components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

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
      title: "",
      content: "",
      createdAt: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    setNotes(updatedNotes)
    if (selectedNote?.id === noteId) {
      setSelectedNote(updatedNotes[0] || null)
    }
  }

  const handleReorderNotes = (reorderedNotes: Note[]) => {
    setNotes(reorderedNotes)
  }

  return (
    <ThemeProvider defaultTheme="system">
      <SidebarProvider>
        <div className="grid grid-cols-[auto_1fr] h-[100vh] overflow-hidden">
          <div className="border-r">
            <Sidebar
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={setSelectedNote}
              onNewNote={createNewNote}
              onDeleteNote={deleteNote}
              onReorderNotes={handleReorderNotes}
              isCollapsed={isCollapsed}
              onToggle={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
          <div>
            <Editor
              note={selectedNote}
              onUpdateNote={(updatedNote) => {
                const updatedNotes = notes.map(note => 
                  note.id === updatedNote.id ? updatedNote : note
                );
                setNotes(updatedNotes);
                setSelectedNote(updatedNote);
              }}
              isCollapsed={isCollapsed}
              onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App