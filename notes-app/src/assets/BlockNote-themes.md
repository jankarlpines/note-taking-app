Themes
Themes let you quickly change the basic look of the editor UI, including colors, borders, shadows, and font. If you want to set more complex styles on the editor, see Overriding CSS.

Themes are only available when using the default Mantine components. ShadCN / Ariakit components can be styled differently.

Theme CSS Variables
A theme is made up of a set of CSS variables, which can be overwritten to change the editor theme. BlockNote comes with two default themes, one for light and one for dark mode, which are selected based on system preference.

Here are each of the theme CSS variables you can set, with values from the default light theme:

--bn-colors-editor-text: #3f3f3f;
--bn-colors-editor-background: #ffffff;
--bn-colors-menu-text: #3f3f3f;
--bn-colors-menu-background: #ffffff;
--bn-colors-tooltip-text: #3f3f3f;
--bn-colors-tooltip-background: #efefef;
--bn-colors-hovered-text: #3f3f3f;
--bn-colors-hovered-background: #efefef;
--bn-colors-selected-text: #ffffff;
--bn-colors-selected-background: #3f3f3f;
--bn-colors-disabled-text: #afafaf;
--bn-colors-disabled-background: #efefef;
--bn-colors-shadow: #cfcfcf;
--bn-colors-border: #efefef;
--bn-colors-side-menu: #cfcfcf;
--bn-colors-highlights-gray-text: #9b9a97;
--bn-colors-highlights-gray-background: #ebeced;
--bn-colors-highlights-brown-text: #64473a;
--bn-colors-highlights-brown-background: #e9e5e3;
--bn-colors-highlights-red-text: #e03e3e;
--bn-colors-highlights-red-background: #fbe4e4;
--bn-colors-highlights-orange-text: #d9730d;
--bn-colors-highlights-orange-background: #f6e9d9;
--bn-colors-highlights-yellow-text: #dfab01;
--bn-colors-highlights-yellow-background: #fbf3db;
--bn-colors-highlights-green-text: #4d6461;
--bn-colors-highlights-green-background: #ddedea;
--bn-colors-highlights-blue-text: #0b6e99;
--bn-colors-highlights-blue-background: #ddebf1;
--bn-colors-highlights-purple-text: #6940a5;
--bn-colors-highlights-purple-background: #eae4f2;
--bn-colors-highlights-pink-text: #ad1a72;
--bn-colors-highlights-pink-background: #f4dfeb;
--bn-font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Open Sans",
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
  "Helvetica Neue", sans-serif;
--bn-border-radius: 6px;

Setting these variables on the .bn-container[data-color-scheme] selector will overwrite them for both default light & dark themes. To overwrite variables separately for light & dark themes, use the .bn-container[data-color-scheme="light"] and .bn-container[data-color-scheme="dark"] selectors.

In the demo below, we set a red theme for the editor which changes based on if light or dark mode is selected (see this in action by changing the website theme in the footer):

Welcome to this demo!

Open up a menu or toolbar to see more of the red theme

Toggle light/dark mode in the page footer and see the theme change too



import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
 
import "./styles.css";
 
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
        content: "Open up a menu or toolbar to see more of the red theme",
      },
      {
        type: "paragraph",
        content:
          "Toggle light/dark mode in the page footer and see the theme change too",
      },
      {
        type: "paragraph",
      },
    ],
  });
 
  // Renders the editor instance using a React component.
  // Adds `data-theming-css-variables-demo` to restrict styles to only this demo.
  return <BlockNoteView editor={editor} data-theming-css-variables-demo />;
}
 

Changing CSS Variables Through Code
You can also set the theme CSS variables using the theme prop in BlockNoteView. Passing a Theme object will overwrite CSS variables for both light & dark themes with values from the object:

type CombinedColor = Partial<{
  text: string;
  background: string;
}>;
 
type ColorScheme = Partial<{
  editor: CombinedColor;
  menu: CombinedColor;
  tooltip: CombinedColor;
  hovered: CombinedColor;
  selected: CombinedColor;
  disabled: CombinedColor;
  shadow: string;
  border: string;
  sideMenu: string;
  highlights: Partial<{
    gray: CombinedColor;
    brown: CombinedColor;
    red: CombinedColor;
    orange: CombinedColor;
    yellow: CombinedColor;
    green: CombinedColor;
    blue: CombinedColor;
    purple: CombinedColor;
    pink: CombinedColor;
  }>;
}>;
 
type Theme = Partial<{
  colors: ColorScheme;
  borderRadius: number;
  fontFamily: string;
}>;

Alternatively, you can overwrite CSS variables the light & dark theme separately by passing the following object type:

type LightAndDarkThemes = {
  light: Theme;
  dark: Theme;
};

In the demo below, we create the same red theme as from the previous demo, but this time we set it using the theme prop in BlockNoteView:

Welcome to this demo!

Open up a menu or toolbar to see more of the red theme

Toggle light/dark mode in the page footer and see the theme change too



import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
 
// Base theme
const lightRedTheme = {
  colors: {
    editor: {
      text: "#222222",
      background: "#ffeeee",
    },
    menu: {
      text: "#ffffff",
      background: "#9b0000",
    },
    tooltip: {
      text: "#ffffff",
      background: "#b00000",
    },
    hovered: {
      text: "#ffffff",
      background: "#b00000",
    },
    selected: {
      text: "#ffffff",
      background: "#c50000",
    },
    disabled: {
      text: "#9b0000",
      background: "#7d0000",
    },
    shadow: "#640000",
    border: "#870000",
    sideMenu: "#bababa",
    highlights: lightDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;
 
// The theme for dark mode,
// users the light theme defined above with a few changes
const darkRedTheme = {
  ...lightRedTheme,
  colors: {
    ...lightRedTheme.colors,
    editor: {
      text: "#ffffff",
      background: "#9b0000",
    },
    sideMenu: "#ffffff",
    highlights: darkDefaultTheme.colors!.highlights,
  },
} satisfies Theme;
 
// The combined "red theme",
// we pass this to BlockNoteView and then the editor will automatically
// switch between lightRedTheme / darkRedTheme based on the system theme
const redTheme = {
  light: lightRedTheme,
  dark: darkRedTheme,
};
 
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
        content: "Open up a menu or toolbar to see more of the red theme",
      },
      {
        type: "paragraph",
        content:
          "Toggle light/dark mode in the page footer and see the theme change too",
      },
      {
        type: "paragraph",
      },
    ],
  });
 
  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} theme={redTheme} />;
}
 

Forcing Light/Dark Mode
By passing "light" or "dark" to the theme prop instead of a Theme object, you can also force BlockNote to always use the light or dark theme.