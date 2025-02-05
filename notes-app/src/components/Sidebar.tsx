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
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onNewNote: () => void
}

function Sidebar({ notes, selectedNote, onSelectNote, onNewNote }: SidebarProps) {
  return (
    <SidebarProvider>
      <ShadcnSidebar className="border-r">
        <SidebarHeader className="border-b p-4">
          <Button 
            onClick={onNewNote}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </SidebarHeader>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <SidebarContent className="p-2">
            <SidebarMenu>
              {notes.map((note) => (
                <SidebarMenuItem key={note.id} className="px-2">
                  <SidebarMenuButton
                    onClick={() => onSelectNote(note)}
                    isActive={selectedNote?.id === note.id}
                    className="w-full p-2 rounded-md"
                  >
                    <span className="line-clamp-1">{note.title || "Untitled"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
      </ShadcnSidebar>
    </SidebarProvider>
  )
}

export default Sidebar