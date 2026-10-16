import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within, userEvent } from 'storybook/test'
import { UnderstandingDemo } from '../../App'

// The "what I understood" pattern — the same demo deployed to the live site, shown here on its own
// (no page header, no theme switch: that's the Theme toolbar above). Mirrors Figma's final journey,
// screens 02 "What I understood" and 03 Plan steps.
const meta = {
  title: 'Patterns/Understanding',
  component: UnderstandingDemo,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UnderstandingDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="panel" style={{ maxWidth: 420 }}>
      <UnderstandingDemo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Said, assumed and missing are all present together, exactly as the journey shows them.
    await expect(canvas.getByRole('button', { name: /^Amount, €3,000\. Tap to change\./ })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /^Deadline, Jul 2027 assumed/ })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /^From account, Choose… Required/ })).toBeInTheDocument()
    // Missing blocks the next step.
    await expect(canvas.getByRole('button', { name: 'Find the money' })).toBeDisabled()
  },
}

export const Editing: Story = {
  render: () => (
    <div className="panel" style={{ maxWidth: 420 }}>
      <UnderstandingDemo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /^Amount/ }))
    const input = await canvas.findByRole('textbox', { name: 'Amount' })
    await userEvent.clear(input)
    await userEvent.type(input, '2500')
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm Amount' }))
    // The person edited the amount: the chip moves to state="edited" and carries the tag.
    await expect(canvas.getByRole('button', { name: /^Amount, €2,500 edited/ })).toBeInTheDocument()
  },
}
