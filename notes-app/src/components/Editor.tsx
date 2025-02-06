import { Note } from '../types'
import "@blocknote/core/fonts/inter.css"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import "../styles/blocknote.css"
import { useCreateBlockNote, SideMenuController } from "@blocknote/react"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Add to imports
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'
import { CustomSideMenu } from './CustomSideMenu'

interface EditorProps {
  note: Note | null
  onUpdateNote: (note: Note) => void
  isCollapsed?: boolean
  onToggleSidebar?: () => void  // Add this prop
}

function Editor({ note, onUpdateNote, isCollapsed = false, onToggleSidebar }: EditorProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState('')

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

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
    },
    icons: {
      dragHandle: (props) => <GripVertical {...props} size={12} />
    }
  })

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      // Trigger auto-resize after setting initial title
      requestAnimationFrame(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
      // Force textarea update after title change
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          const event = new Event('input', { bubbles: true });
          textarea.dispatchEvent(event);
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      }, 0);
    }
  }, [note?.id, note?.title])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!note) return;
    const newTitle = e.target.value.replace(/\n/g, '');
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
    <div className={cn("h-full px-4 py-6 lg:px-8 w-full")}>
      <Tabs defaultValue="editor" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <div className="flex items-center gap-2">
            <div className={cn(
              "transition-transform duration-300 ease-in-out",
              !isCollapsed && "-translate-x-full opacity-0"
            )}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="flex-shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <TabsList>
              <TabsTrigger value="editor" className="relative">
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent
          value="editor"
          className="border-none p-0 outline-none"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 w-full">
              <textarea
                value={title}
                onChange={(e) => {
                  handleTitleChange(e);
                  autoResize(e);
                }}
                className="w-full text-4xl font-bold tracking-tight border-none bg-transparent px-0 resize-none focus:outline-none overflow-hidden whitespace-pre-wrap break-words"
                placeholder="Untitled"
                rows={1}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                    
                    const editorElement = document.querySelector('[contenteditable="true"]');
                    if (editorElement instanceof HTMLElement) {
                      editorElement.focus();
                      await editor.insertBlocks(
                        [{ type: "paragraph", content: [] }],
                        null,
                        'end'
                      );
                      // Get the newly inserted block
                      const blocks = editor.topLevelBlocks;
                      const lastBlock = blocks[blocks.length - 1];
                      if (lastBlock) {
                        editor.setSelection({
                          anchor: { block: lastBlock, offset: 0 },
                          focus: { block: lastBlock, offset: 0 }
                        });
                      }
                    }
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Created on {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className={cn(
              "relative px-4 md:px-6 lg:px-8",
              isCollapsed ? "max-w-none" : "max-w-[90ch] mx-auto"
            )}>
              <BlockNoteView 
                editor={editor} 
                onChange={handleEditorChange}
                theme={theme === "dark" ? "dark2" : "light"}
                sideMenu={false}
              >
                <SideMenuController
                  sideMenu={(props) => <CustomSideMenu {...props} />}
                />
              </BlockNoteView>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="preview"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Preview
              </h2>
              <p className="text-sm text-muted-foreground">
                View your formatted note.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className={cn(
              "prose dark:prose-invert mx-auto px-4 md:px-6 lg:px-8",
              isCollapsed ? "max-w-none" : "max-w-[90ch]"
            )}>
              {/* Add preview content here */}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Editor