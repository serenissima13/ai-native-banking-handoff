// url=<FIGMA_FILE>?node-id=30-49
// source=src/components/Icon/Icon.tsx
// component=Icon
import figma from 'figma'

export default {
  example: figma.tsx`<Icon name="category" />`,
  imports: ['import { Icon } from "@/components/Icon"'],
  id: 'icon-category',
  // parameter: the name ParameterChip reads for its aria-label when this icon is its leading icon
  metadata: { nestable: true, props: { parameter: 'Category' } },
}
