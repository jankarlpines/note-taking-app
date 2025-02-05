import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import notesData from './data/notes.json'
import { Note } from './types'

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
    <div className="flex h-screen">
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
        onNewNote={createNewNote}
      />
      <Editor
        note={selectedNote}
        onChange={(updatedNote) => {
          setNotes(notes.map(note => 
            note.id === updatedNote.id ? updatedNote : note
          ))
          setSelectedNote(updatedNote)
        }}
      />
    </div>
  )
}

export default App