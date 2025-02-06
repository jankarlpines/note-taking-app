Block Side Menu
The Block Side Menu appears on the left side whenever you hover a block. By default, it consists of a + button and a drag handle (⠿):

Side menu
Clicking the drag handle (⠿) in the Block Side Menu opens the Drag Handle Menu:

image
Changing the Block Side Menu
You can change or replace the Block Side Menu with your own React component. In the demo below, the button to add a new block is replaced with one to remove the hovered block.

Welcome to this demo!

<- Notice the new button in the side menu



import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
 
import { RemoveBlockButton } from "./RemoveBlockButton";
 
export default function App() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
        content: "<- Notice the new button in the side menu",
      },
      {
        type: "paragraph",
        content: "Click it to remove the hovered block",
      },
      {
        type: "paragraph",
      },
    ],
  });
 
  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} sideMenu={false}>
      <SideMenuController
        sideMenu={(props) => (
          <SideMenu {...props}>
            {/* Button which removes the hovered block. */}
            <RemoveBlockButton {...props} />
            <DragHandleButton {...props} />
          </SideMenu>
        )}
      />
    </BlockNoteView>
  );
}
 

We first define our custom RemoveBlockButton. The useComponentsContext hook gets all components used internally by BlockNote, so we want to use Components.SideMenu.Button for this.

We use the SideMenu component to create a custom Block Side Menu. By specifying its children, we can replace the default buttons in the menu with our own.

This custom Side Menu is passed to a SideMenuController, which controls its position and visibility (on the left side when you hover a block).

Setting sideMenu={false} on BlockNoteView tells BlockNote not to show the default Block Side Menu.

Changing Drag Handle Menu Items
You can also change the items in the Drag Handle Menu. The demo below adds an item that resets the block type to a paragraph.

Click it to remove the hovered block

<- Click the Drag Handle to see the new item

Welcome to this demo!



import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
 
import { ResetBlockTypeItem } from "./ResetBlockTypeItem";
 
export default function App() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
        content: "<- Click the Drag Handle to see the new item",
      },
      {
        type: "bulletListItem",
        content:
          "Try resetting this block's type using the new Drag Handle Menu item",
      },
      {
        type: "paragraph",
      },
    ],
  });
 
  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} sideMenu={false}>
      <SideMenuController
        sideMenu={(props) => (
          <SideMenu
            {...props}
            dragHandleMenu={(props) => (
              <DragHandleMenu {...props}>
                <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
                <BlockColorsItem {...props}>Colors</BlockColorsItem>
                {/* Item which resets the hovered block's type. */}
                <ResetBlockTypeItem {...props}>Reset Type</ResetBlockTypeItem>
              </DragHandleMenu>
            )}
          />
        )}
      />
    </BlockNoteView>
  );
}
 

Here, we use the SideMenu component but keep the default buttons (we don't pass any children). Instead, we pass our customized Drag Handle Menu using the dragHandleMenu prop.