import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Icon } from './Icon'

const FIGMA_FILE = 'https://www.figma.com/design/oYKI1xZAtJvaO62wPJhN8L/AI-native-mobile-banking'
const figmaDesign = (nodeId: string) => ({ design: { type: 'figma' as const, url: `${FIGMA_FILE}?node-id=${nodeId}` } })

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['ai-generated'],
  args: { name: 'amount' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

// size/icon/md = 20 is the default; the size prop reaches the SVG.
// Node ids match the ones in each icon-*.figma.ts Code Connect template.
export const Amount: Story = {
  parameters: figmaDesign('30-39'),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    await expect(svg).toHaveAttribute('width', '20')
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
  },
}

export const Deadline: Story = { args: { name: 'date' }, parameters: figmaDesign('30-45') }
export const Category: Story = { args: { name: 'category' }, parameters: figmaDesign('30-49') }
export const Account: Story = { args: { name: 'account' }, parameters: figmaDesign('30-54') }
export const Small: Story = { args: { name: 'check', size: 16 } }
export const Large: Story = { args: { name: 'sparkle', size: 24 } }
