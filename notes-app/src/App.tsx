import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import notesData from './data/notes.json'
import { Note } from './types'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

function App() {
  // Load notes from localStorage on initial render, fallback to notesData
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : notesData.notes
  })
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])

  // Save to localStorage whenever notes change
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
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <Sidebar
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
            onNewNote={createNewNote}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <Editor
            note={selectedNote}
            onChange={(updatedNote) => {
              setNotes(notes.map(note => 
                note.id === updatedNote.id ? updatedNote : note
              ))
              setSelectedNote(updatedNote)
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App