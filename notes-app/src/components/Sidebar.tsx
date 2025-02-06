import { Note } from '../types'
import { Plus, ChevronLeft, ChevronRight, FileText, FolderOpen, Settings, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface SidebarProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onNewNote: () => void
  isCollapsed: boolean
  onToggle: () => void
}

function Sidebar({ notes, selectedNote, onSelectNote, onNewNote, isCollapsed, onToggle }: SidebarProps) {
  return (
    <ScrollArea className="h-[100vh] px-1">
    <div className={cn("pb-12", isCollapsed ? "w-[50px]" : "w-[250px]")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2 px-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              onClick={onNewNote}
              variant="secondary"
              className="w-full justify-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              {!isCollapsed && "New Note"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              {!isCollapsed && "Search"}
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {!isCollapsed && "Library"}
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              {!isCollapsed && "All Notes"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FolderOpen className="mr-2 h-4 w-4" />
              {!isCollapsed && "Folders"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              {!isCollapsed && "Settings"}
            </Button>
          </div>
        </div>

        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            {!isCollapsed && "Notes"}
          </h2>
          
            <div className="space-y-1 p-2">
              {notes.map((note) => (
                <Button
                  key={note.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal",
                    selectedNote?.id === note.id && "bg-muted"
                  )}
                  onClick={() => onSelectNote(note)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {!isCollapsed && (
                    <span className="line-clamp-1">{note.title || "Untitled"}</span>
                  )}
                </Button>
              ))}
            </div>

        </div>
      </div>
    </div>
    </ScrollArea>
  )
}

export default Sidebar