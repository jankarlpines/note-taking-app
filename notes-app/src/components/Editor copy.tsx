import { Note } from '../types'
import "@blocknote/core/fonts/inter.css"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import { useEffect } from "react"
import { BlockNoteEditor } from "@blocknote/core"

interface EditorProps {
 note: Note | null
 onChange: (note: Note) => void
}

function Editor({ note, onChange }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: note?.content ? JSON.parse(note.content) : [{
      type: "paragraph",
      content: []
    }],
    domAttributes: {
      editor: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none w-full"
      }
    }
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

 // Early return after hook initialization
 if (!note) return <div className="flex-1 p-4">Select a note</div>

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
   <div className="flex-1 p-4">
     <input
       type="text"
       value={note.title}
       onChange={(e) => onChange({ ...note, title: e.target.value })}
       className="bg-white text-2xl font-bold mb-4 w-full max-w-[800px] mx-auto"
     />
     <div className="bg-white w-full h-[calc(100vh-200px)] border rounded overflow-hidden">
       <div className="h-full overflow-y-auto px-4">
         <BlockNoteView editor={editor} onChange={handleEditorChange} />
       </div>
     </div>
   </div>
 )
}

export default Editor