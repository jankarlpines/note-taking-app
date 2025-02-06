import { Note } from '../types'

export function getNotes(): Note[] {
  const notesJson = localStorage.getItem('notes')
  if (!notesJson) return []
  return JSON.parse(notesJson).notes
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem('notes', JSON.stringify({ notes }))
}

export function createNote(parentId: string | null = null): Note {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled Note',
    content: '[{"type":"paragraph","content":[]}]',
    createdAt: new Date().toISOString(),
    parentId,
    children: []
  }
}

export function buildNoteTree(notes: Note[]): Note[] {
  const noteMap = new Map(notes.map(note => [note.id, { ...note }]))
  const tree: Note[] = []

  for (const note of notes) {
    if (note.parentId === null) {
      tree.push(noteMap.get(note.id)!)
    } else {
      const parent = noteMap.get(note.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(note.id)
      }
    }
  }

  return tree
}