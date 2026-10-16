import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Icon } from './Icon'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['ai-generated'],
  args: { name: 'amount' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

// size/icon/md = 20 is the default; the size prop reaches the SVG.
export const Amount: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    await expect(svg).toHaveAttribute('width', '20')
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
  },
}

export const Deadline: Story = { args: { name: 'date' } }
export const Category: Story = { args: { name: 'category' } }
export const Account: Story = { args: { name: 'account' } }
export const Small: Story = { args: { name: 'check', size: 16 } }
export const Large: Story = { args: { name: 'sparkle', size: 24 } }
