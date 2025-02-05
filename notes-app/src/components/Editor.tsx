import { Note } from '../types'
import "@blocknote/core/fonts/inter.css"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import { useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface EditorProps {
 note: Note | null
 onChange: (note: Note) => void
}

function Editor({ note, onChange }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: note?.content ? JSON.parse(note.content) : [{
      type: "paragraph",
      content: []
    }]
  })

  const handleEditorChange = () => {
    if (!note) return;
    try {
      onChange({
        ...note,
        content: JSON.stringify(editor.topLevelBlocks)
      })
    } catch (error) {
      console.error('Error in editor onChange:', error);
    }
  }

  if (!note) return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Select a note to view</p>
    </div>
  )

 // Reset editor content when note changes
 useEffect(() => {
   try {
     const newContent = note.content ? JSON.parse(note.content) : []
     const currentContent = JSON.stringify(editor.topLevelBlocks)
     if (currentContent !== note.content) {
       editor.replaceBlocks(editor.topLevelBlocks, newContent)
     }
   } catch (error) {
     console.error('Error parsing note content:', error)
     editor.replaceBlocks(editor.topLevelBlocks, [])
   }
 }, [note.id, editor, note.content])

 return (
   <div className="flex h-full flex-col">
     <div className="border-b px-4 py-2">
       <Input
         type="text"
         value={note.title}
         onChange={(e) => onChange({ ...note, title: e.target.value })}
         className="text-lg font-semibold border-none bg-transparent px-0"
         placeholder="Untitled"
       />
       <p className="text-xs text-muted-foreground">
         Created on {new Date(note.createdAt).toLocaleDateString()}
       </p>
     </div>
     <ScrollArea className="flex-1">
       <div className="h-full p-4">
         <BlockNoteView editor={editor} onChange={handleEditorChange} />
       </div>
     </ScrollArea>
   </div>
 )
}

export default Editor