import { Note } from '../types'
import { useState, useEffect } from 'react'
import { PlusIcon, ChevronLeft, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from "@/lib/utils"
import { buildNoteTree, createNote } from '@/lib/note-utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Trash } from "lucide-react"
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronRight } from 'lucide-react'

interface SortableNoteItemProps {
  note: Note
  notes: Note[]
  level: number
  selectedNote: Note | null
  dragOverId: string | null
  dragPosition: { id: string | null, position: 'inside' | 'between', placement?: 'before' | 'after' } | null
  onSelect: (note: Note) => void
  onDelete: (id: string) => void
}

function SortableNoteItem({ note, notes, level, selectedNote, dragOverId, dragPosition, onSelect, onDelete }: SortableNoteItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const childNotes = notes.filter(n => n.parentId === note.id)
  const hasChildren = childNotes.length > 0

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: note.id,
    data: {
      type: 'note',
      note,
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            ref={setNodeRef} 
            style={{ ...style, transform: 'none' }}
            data-id={note.id}
            className={cn(
              "flex items-center group cursor-pointer rounded-md overflow-hidden relative w-[284px] py-1",
              dragPosition?.id === note.id && dragPosition?.position === 'inside' && 
                "bg-blue-500/20",
              dragPosition?.id === note.id && dragPosition?.position === 'between' && dragPosition?.placement === 'before' &&
                "before:absolute before:left-0 before:right-0 before:h-[2px] before:bg-blue-500 before:top-0",
              dragPosition?.id === note.id && dragPosition?.position === 'between' && dragPosition?.placement === 'after' &&
                "after:absolute after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 after:bottom-0",
            )}
            {...attributes}
            {...listeners}
          >
            <div style={{ paddingLeft: `${level * 12}px` }} className="flex items-center w-full px-1">
              <div className="w-5 h-5 mr-1 flex-shrink-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-5 w-5 p-0", !hasChildren && "opacity-0")}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                >
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-transform",
                    isExpanded ? "rotate-90" : ""
                  )} />
                </Button>
              </div>
              <Button
                variant={note.id === selectedNote?.id ? "secondary" : "ghost"}
                className="flex-1 justify-start overflow-hidden px-2 h-7"
                onClick={() => onSelect(note)}
              >
                <span className="truncate block w-full text-start">{note.title || "Untitled"}</span>
              </Button>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              const newNote = createNote(note.id)
            }}
          >
            Add Subnote
          </ContextMenuItem>
          <ContextMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(note.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Note
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {isExpanded && hasChildren && childNotes.map((childNote) => (
        <SortableNoteItem
          key={childNote.id}
          note={childNote}
          notes={notes}
          level={level + 1}
          selectedNote={selectedNote}
          dragOverId={dragOverId}
          dragPosition={dragPosition}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}

interface SidebarProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onNewNote: () => void
  onDeleteNote: (id: string) => void
  onReorderNotes: (notes: Note[]) => void
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({
  notes,
  selectedNote,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  onReorderNotes,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<{ id: string | null, position: 'inside' | 'between', placement?: 'before' | 'after' } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12,
        tolerance: 90,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragOver(event: DragOverEvent) {
    const { over, active } = event
    if (!over || over.id === active.id) {
      setDragPosition(null)
      return
    }

    const overElement = document.querySelector(`[data-id="${over.id}"]`) as HTMLElement
    if (!overElement) return

    const rect = overElement.getBoundingClientRect()
    const mouseY = event.activatorEvent.clientY
    const relativeY = mouseY - rect.top

    const topZone = rect.height * 0.25
    const bottomZone = rect.height * 0.75

    if (relativeY < topZone) {
      setDragPosition({ 
        id: over.id as string, 
        position: 'between',
        placement: 'before'
      })
    } else if (relativeY > bottomZone) {
      setDragPosition({ 
        id: over.id as string, 
        position: 'between',
        placement: 'after'
      })
    } else {
      setDragPosition({ id: over.id as string, position: 'inside' })
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    setDragPosition(null)
    const { active, over } = event
  
    if (!over || active.id === over.id) return
  
    const activeNoteId = active.id as string
    const overNoteId = over.id as string
  
    const activeNote = notes.find(n => n.id === activeNoteId)
    const overNote = notes.find(n => n.id === overNoteId)
    
    if (!activeNote || !overNote) return
    if (isNoteDescendant(notes, activeNoteId, overNoteId)) return

    const descendants = getAllDescendants(notes, activeNoteId)
    const updatedNotes = [...notes]
    
    const notesToMove = [activeNote, ...descendants]
    const remainingNotes = updatedNotes.filter(note => 
      !notesToMove.some(n => n.id === note.id)
    )

    if (dragPosition?.position === 'inside') {
      const existingChildren = remainingNotes.filter(n => n.parentId === overNoteId)
      const insertIndex = remainingNotes.findIndex(n => n.id === overNoteId) + existingChildren.length + 1

      const movedNotes = notesToMove.map(note => ({
        ...note,
        parentId: note.id === activeNoteId ? overNoteId : note.parentId
      }))

      remainingNotes.splice(insertIndex, 0, ...movedNotes)
    } else {
      const overIndex = remainingNotes.findIndex(n => n.id === overNoteId)

      const movedNotes = notesToMove.map(note => ({
        ...note,
        parentId: note.id === activeNoteId ? overNote.parentId : note.parentId
      }))

      const insertIndex = dragPosition?.placement === 'before' 
        ? overIndex 
        : overIndex + 1

      remainingNotes.splice(insertIndex, 0, ...movedNotes)
    }

    onReorderNotes(remainingNotes)
  }

  function getAllDescendants(notes: Note[], noteId: string): Note[] {
    const descendants: Note[] = []
    const children = notes.filter(n => n.parentId === noteId)
    
    children.forEach(child => {
      descendants.push(child)
      descendants.push(...getAllDescendants(notes, child.id))
    })
    
    return descendants
  }

  function isNoteDescendant(notes: Note[], noteId: string, potentialParentId: string): boolean {
    const note = notes.find(n => n.id === potentialParentId)
    if (!note) return false
    if (note.parentId === noteId) return true
    if (note.parentId) return isNoteDescendant(notes, noteId, note.parentId)
    return false
  }

  return (
    <div className={cn(
      "pb-6 transition-[width] duration-300 ease-in-out overflow-hidden w-[300px]",
      isCollapsed ? "w-0" : "w-[300px]"
    )}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 space-y-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggle} 
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onNewNote} 
              variant="ghost" 
              className="h-8 w-8 p-0"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="px-1 text-lg font-semibold tracking-tight">
            Notes
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1 px-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragCancel={() => setDragOverId(null)}
            >
              <SortableContext
                items={notes.map(note => note.id)}
                strategy={verticalListSortingStrategy}
              >
                {buildNoteTree(notes)
                  .map((note) => (
                    <SortableNoteItem
                      key={note.id}
                      note={note}
                      notes={notes}
                      level={0}
                      selectedNote={selectedNote}
                      dragOverId={dragOverId}
                      dragPosition={dragPosition}
                      onSelect={onSelectNote}
                      onDelete={onDeleteNote}
                    />
                  ))}
              </SortableContext>
              <DragOverlay dropAnimation={null}>
                {activeId ? (
                  <div className="bg-background border rounded-md p-2 shadow-lg opacity-30">
                    <div style={{ paddingLeft: '12px' }} className="flex items-center">
                      <span className="truncate">
                        {notes.find(n => n.id === activeId)?.title || "Untitled"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}