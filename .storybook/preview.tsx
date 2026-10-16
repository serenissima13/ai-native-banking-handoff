import type { Preview } from '@storybook/react-vite'
// The same root CSS as src/main.tsx: generated tokens, text/effect styles, then the page shell.
import '../src/tokens/tokens.css'
import '../src/tokens/styles.css'
import '../src/App.css'

const preview: Preview = {
  // Light / Dark is the only app-level state: tokens.css switches on <html data-theme>. Dark is the app default.
  globalTypes: {
    theme: {
      description: 'Theme (Semantic mode)',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, { globals }) => {
      document.documentElement.dataset.theme = globals.theme === 'light' ? 'light' : 'dark'
      return <Story />
    },
  ],
  parameters: {
    // App.css paints the canvas from the tokens; Storybook's own backgrounds would hide it.
    backgrounds: { disable: true },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // Sidebar mirrors the Figma file's own page order: 01 Introduction, 03 Foundations,
    // 04 Components, 05 Patterns. Anything not listed keeps its natural (alphabetical) order.
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components', ['Icon', 'ParameterChip'], 'Patterns', ['Understanding']],
      },
    },
  },
};

export default preview;