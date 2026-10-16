import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { WhatIUnderstood } from '../../patterns/WhatIUnderstood'

// "What I understood" — the moment the ParameterChip was designed for, as on Figma 05 Screens › 02
// Understanding (node 253:361). The same code as the live demo. Theme comes from the toolbar.
const meta = {
  title: 'Patterns/Understanding',
  component: WhatIUnderstood,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ maxWidth: 402 }}>
      <WhatIUnderstood />
    </div>
  ),
} satisfies Meta<typeof WhatIUnderstood>

export default meta
type Story = StoryObj<typeof meta>

// As the screen opens: the amount was said, the date was assumed from "next summer".
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Amount, €3,000. Tap to change.' })).not.toHaveAttribute('aria-haspopup')
    await expect(canvas.getByRole('button', { name: /^When, 1 Jul 2027 · 9 months assumed/ })).toHaveAttribute('aria-haspopup', 'menu')
    await expect(canvas.getByText('From "next summer": I took the start of July.')).toBeVisible()
    await expect(canvas.getByText("You'd need about €334 a month.")).toBeVisible()
  },
}

// Select: pick another month → the chip becomes Edited, the plan recalculates, the conversation records it.
export const ChangeTheDeadline: Story = {
  play: async ({ canvas, userEvent, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^When/ }))
    const menu = within(canvasElement).getByRole('menu', { name: 'When do you want it by?' })
    await userEvent.click(within(menu).getByRole('menuitemradio', { name: /1 Aug 2027/ }))
    await expect(canvas.getByRole('button', { name: /^When, 1 Aug 2027 · 10 months edited/ })).toBeInTheDocument()
    await expect(canvas.queryByText('From "next summer": I took the start of July.')).toBeNull()
    await expect(canvas.getByText("You'd need about €300 a month.")).toBeVisible()
    await expect(canvas.getByText('You changed the deadline to August · €300 a month')).toBeVisible()
  },
}

// Input: edit the amount in place → Edited, recalculated.
export const EditTheAmount: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Amount/ }))
    const input = await canvas.findByRole('textbox', { name: 'Amount' })
    await userEvent.clear(input)
    await userEvent.type(input, '2500')
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm Amount' }))
    await expect(canvas.getByRole('button', { name: /^Amount, €2,500 edited/ })).toBeInTheDocument()
    await expect(canvas.getByText("You'd need about €278 a month.")).toBeVisible()
  },
}
