import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Icon } from '../Icon'
import { ParameterChip } from './ParameterChip'

// Three separate controls, as in Figma: type (how the value changes), state (where it came from),
// open / editing (what is happening now — open for select, editing for input).
// Figma: 04 Components › Chip / ParameterChip, component set 31:123.
// No per-story "Design" tab: the file doesn't have embedding turned on (Share → Allow embedding),
// so the addon-designs panel only shows Figma's own 403, not the design — worse than no tab at all.
const meta = {
  title: 'Components/ParameterChip',
  component: ParameterChip,
  tags: ['ai-generated'],
  args: {
    parameter: 'Amount',
    type: 'input',
    state: 'confirmed',
    value: '€3,000',
    icon: <Icon name="amount" />,
    onPress: fn(),
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['input', 'select'] },
    state: { control: 'select', options: ['confirmed', 'assumed', 'missing', 'edited', 'output'] },
  },
} satisfies Meta<typeof ParameterChip>

export default meta
type Story = StoryObj<typeof meta>

const deadline = { parameter: 'Deadline', type: 'select', value: '1 Jul 2027', icon: <Icon name="date" /> } as const

/* ── Type ─────────────────────────────────────────────── */

// Input: typed in place. No popup; the accessible name carries parameter, value and the next step.
export const Input: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const chip = canvas.getByRole('button', { name: 'Amount, €3,000. Tap to change.' })
    await expect(chip).not.toHaveAttribute('aria-haspopup')
    await userEvent.click(chip)
    await expect(args.onPress).toHaveBeenCalledOnce()
  },
}

// Select: picked from a list. Announces the menu it opens, whatever the state.
export const Select: Story = {
  args: deadline,
  play: async ({ canvas }) => {
    const chip = canvas.getByRole('button', { name: 'Deadline, 1 Jul 2027. Tap to change.' })
    await expect(chip).toHaveAttribute('aria-haspopup', 'menu')
    await expect(chip).toHaveAttribute('aria-expanded', 'false')
  },
}

/* ── State (shown on a select; any state works with either type) ── */

export const Assumed: Story = {
  args: { ...deadline, state: 'assumed' },
}

// Same state, other type: an assumed amount is still typed in place — no menu.
export const AssumedInput: Story = {
  args: { state: 'assumed' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /^Amount, €3,000 assumed/ })).not.toHaveAttribute('aria-haspopup')
  },
}

export const Missing: Story = {
  args: { parameter: 'From account', type: 'select', state: 'missing', value: undefined, icon: <Icon name="account" /> },
  play: async ({ canvas }) => {
    // Missing shows the placeholder; the name repeats it word for word and adds "Required" (WCAG 2.5.3).
    await expect(canvas.getByRole('button', { name: 'From account, Choose… Required. Tap to change.' })).toBeVisible()
    await expect(canvas.getByText('Choose…')).toBeVisible()
  },
}

export const Edited: Story = {
  args: { ...deadline, state: 'edited', value: '1 Aug 2027' },
}

// Output is read-only whatever the type: no button at all.
export const Output: Story = {
  args: { state: 'output', parameter: 'Monthly saving', value: '≈ €334', type: 'select', open: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(canvas.getByText('Monthly saving, ≈ €334, calculated by the assistant.')).toBeInTheDocument()
  },
}

/* ── Interaction (scoped by type) ─────────────────────── */

export const Open: Story = {
  args: { ...deadline, state: 'assumed', open: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /^Deadline, 1 Jul 2027 assumed/ })).toHaveAttribute('aria-expanded', 'true')
  },
}

export const Editing: Story = {
  args: { editing: true },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Amount' })
    await expect(input).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear Amount' }))
    await userEvent.type(input, '2500')
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm Amount' }))
    await expect(args.onConfirm).toHaveBeenCalledWith('2500')
  },
}

// A select cannot be edited in place: `editing` is ignored and the chip stays a button.
export const EditingIgnoredOnSelect: Story = {
  args: { ...deadline, editing: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(canvas.getByRole('button', { name: /^Deadline/ })).toHaveAttribute('aria-haspopup', 'menu')
  },
}

// The whole matrix at once, as on Figma page 04: rows = State, columns = Type × its own interaction.
const states = ['confirmed', 'assumed', 'missing', 'edited'] as const
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'max-content repeat(4, max-content)', gap: 16, alignItems: 'center', justifyItems: 'start', overflowX: 'auto' }}>
      <span />
      <span className="text-caption">Input · rest</span>
      <span className="text-caption">Input · editing</span>
      <span className="text-caption">Select · rest</span>
      <span className="text-caption">Select · open</span>
      {states.map((state) => [
        <span key={`${state}-l`} className="text-label-md">{state}</span>,
        <ParameterChip key={`${state}-i`} parameter="Amount" type="input" state={state} value="€3,000" icon={<Icon name="amount" />} />,
        <ParameterChip key={`${state}-e`} parameter={`Amount ${state}`} type="input" state={state} value="€3,000" icon={<Icon name="amount" />} editing />,
        <ParameterChip key={`${state}-s`} parameter="Deadline" type="select" state={state} value="1 Jul 2027" icon={<Icon name="date" />} />,
        <ParameterChip key={`${state}-o`} parameter="Deadline" type="select" state={state} value="1 Jul 2027" icon={<Icon name="date" />} open />,
      ])}
      <span className="text-label-md">output</span>
      <ParameterChip parameter="Monthly saving" state="output" value="≈ €334" />
    </div>
  ),
}

// Proves the shared preview loaded the token CSS and the component CSS:
// .pchip { min-height: var(--parameter-chip-height-min) } → size/touch-target-min = 44px,
// and State=Assumed draws a dashed edge (ParameterChip.css).
export const CssCheck: Story = {
  args: { ...deadline, state: 'assumed' },
  play: async ({ canvas }) => {
    const chip = canvas.getByRole('button', { name: /^Deadline/ })
    await expect(getComputedStyle(chip).minHeight).toBe('44px')
    await expect(getComputedStyle(chip).borderTopStyle).toBe('dashed')
  },
}
