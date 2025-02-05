import { Note } from '../types'
import "@blocknote/core/fonts/inter.css"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"

interface EditorProps {
  note: Note | null
  onUpdateNote: (note: Note) => void
}

function Editor({ note, onUpdateNote }: EditorProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState('')

  const editor = useCreateBlockNote({
    initialContent: [{
      type: "paragraph",
      content: []
    }],
    domAttributes: {
      editor: {
        class: "prose dark:prose-invert min-h-screen max-w-none"
      },
      content: {
        class: "w-full max-w-[65ch] md:max-w-[75ch] lg:max-w-[85ch] mx-auto"
      }
    }
  })

  useEffect(() => {
    if (note) {
      setTitle(note.title)
    }
  }, [note?.id, note?.title])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return;
    const newTitle = e.target.value;
    setTitle(newTitle)
    onUpdateNote({
      ...note,
      title: newTitle
    });
  };

  const handleEditorChange = () => {
    if (!note) return;
    try {
      onUpdateNote({
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

  useEffect(() => {
    if (!note) return;
    try {
      const content = note.content ? JSON.parse(note.content) : [{
        type: "paragraph",
        content: []
      }]
      editor.replaceBlocks(editor.topLevelBlocks, content)
    } catch (error) {
      console.error('Error parsing note content:', error)
      editor.replaceBlocks(editor.topLevelBlocks, [{
        type: "paragraph",
        content: []
      }])
    }
  }, [note?.id])

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-lg font-semibold border-none bg-transparent px-0"
          placeholder="Untitled"
        />
        <p className="text-xs text-muted-foreground">
          Created on {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-5rem)]">
        <div className="h-full py-8 px-4 md:px-6 lg:px-8">
          <BlockNoteView 
            editor={editor} 
            onChange={handleEditorChange}
            theme={theme === "dark" ? "dark" : "light"}
          />
        </div>
      </ScrollArea>
    </div>
  )
}

export default Editor