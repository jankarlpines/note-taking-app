import { Note } from '../types'
import { Plus } from 'lucide-react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onNewNote: () => void
}

function Sidebar({ notes, selectedNote, onSelectNote, onNewNote }: SidebarProps) {
  return (
    <SidebarProvider>
      <ShadcnSidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <Button 
            onClick={onNewNote}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {notes.map((note) => (
              <SidebarMenuItem key={note.id}>
                <SidebarMenuButton
                  onClick={() => onSelectNote(note)}
                  isActive={selectedNote?.id === note.id}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">{note.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarProvider>
  )
}

export default Sidebar