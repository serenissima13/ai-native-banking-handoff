// url=<FIGMA_FILE>?node-id=31-123
// source=src/components/ParameterChip/ParameterChip.tsx
// component=ParameterChip
import figma from 'figma'
const instance = figma.selectedInstance

// TEXT
const value = instance.getString('Value')
const placeholder = instance.getString('Placeholder')

// VARIANT · Type — how the value is changed. Read-only only exists with State=Output, which needs no type.
const type = instance.getEnum('Type', {
  Input: 'input',
  Select: 'select',
  'Read-only': '',
})

// VARIANT · State — where the value came from; every value mapped
const state = instance.getEnum('State', {
  Confirmed: 'confirmed',
  Assumed: 'assumed',
  Missing: 'missing',
  Output: 'output',
  Edited: 'edited',
})

// VARIANT · Interaction — what is happening now. Pressed and Focused are runtime CSS states
// (:active, :focus-visible), not props. Open exists only with Type=Select, Editing only with Type=Input.
const open = instance.getEnum('Interaction', {
  Default: false,
  Pressed: false,
  Focused: false,
  Open: true,
  Editing: false,
})
const editing = instance.getEnum('Interaction', {
  Default: false,
  Pressed: false,
  Focused: false,
  Open: false,
  Editing: true,
})

// BOOLEAN + INSTANCE_SWAP · Leading icon (the Icon templates also pass the parameter name for aria-label)
const showIcon = instance.getBoolean('Show leading icon')
const iconInstance = showIcon && state !== 'output' ? instance.getInstanceSwap('Leading icon') : null
let iconCode
let parameter = 'Parameter'
if (iconInstance && iconInstance.type === 'INSTANCE') {
  const result = iconInstance.executeTemplate()
  iconCode = result.example
  if (result.metadata && result.metadata.props && result.metadata.props.parameter) {
    parameter = result.metadata.props.parameter
  }
}

export default {
  example: figma.tsx`<ParameterChip
  parameter="${parameter}"
  ${type ? figma.tsx`type="${type}"` : ''}
  state="${state}"
  ${state === 'missing' ? figma.tsx`placeholder="${placeholder}"` : figma.tsx`value="${value}"`}
  ${iconCode ? figma.tsx`icon={${iconCode}}` : ''}
  ${open ? 'open' : ''}
  ${editing ? 'editing' : ''}
/>`,
  imports: ['import { ParameterChip } from "@/components/ParameterChip"'],
  id: 'parameter-chip',
  metadata: { nestable: true },
}
