import { GripVertical, Plus } from 'lucide-react'
import {
  DragHandleButton,
  SideMenu,
  AddBlockButton,
  DragHandleMenu,
  RemoveBlockItem,
  BlockColorsItem,
} from "@blocknote/react"

export function CustomSideMenu(props: any) {
  return (
    <SideMenu
      {...props}
      dragHandleMenu={(props) => (
        <DragHandleMenu {...props}>
          <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
          <BlockColorsItem {...props}>Colors</BlockColorsItem>
        </DragHandleMenu>
      )}
    >
      <AddBlockButton {...props}>
        <Plus className="h-2.5 w-2.5" />
      </AddBlockButton>
      <DragHandleButton {...props}>
        <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
      </DragHandleButton>
    </SideMenu>
  )
}