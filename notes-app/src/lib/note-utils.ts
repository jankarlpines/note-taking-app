import { Note } from '../types'

export function buildNoteTree(notes: Note[]): Note[] {
  const rootNotes = notes.filter(note => !note.parentId)
  return rootNotes.map(note => ({
    ...note,
    children: getChildNotes(notes, note.id)
  }))
}

function getChildNotes(notes: Note[], parentId: string): string[] {
  return notes
    .filter(note => note.parentId === parentId)
    .map(note => note.id)
}

export function createNote(parentId: string | null = null): Note {
  const timestamp = Date.now()
  const random = crypto.randomUUID()
  return {
    id: `note-${timestamp}-${random}`,
    title: 'Untitled Note',
    content: '[{"type":"paragraph","content":[]}]',
    createdAt: new Date().toISOString(),
    parentId,
    children: []
  }
}