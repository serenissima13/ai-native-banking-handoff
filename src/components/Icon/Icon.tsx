/**
 * Icon · the subset of the Figma icon set (page 04 › Icon / Icon set) used by ParameterChip and the
 * "What I understood" pattern (info: provenance and conversation-log lines).
 * Paths are exported from Figma as SVG; stroke uses currentColor so the parent sets the colour.
 */
const paths = {
  amount: [
    'M14.1667 5.41675C13.3064 4.73943 12.2728 4.31792 11.1842 4.20043C10.0955 4.08294 8.99584 4.27421 8.01082 4.75237C7.0258 5.23053 6.19525 5.97627 5.61416 6.90429C5.03306 7.83231 4.72489 8.90514 4.72489 10.0001C4.72489 11.095 5.03306 12.1679 5.61416 13.0959C6.19525 14.0239 7.0258 14.7696 8.01082 15.2478C8.99584 15.726 10.0955 15.9172 11.1842 15.7997C12.2728 15.6822 13.3064 15.2607 14.1667 14.5834',
    'M3.33333 8.33325H10.8333',
    'M3.33333 11.6667H10.8333',
  ],
  date: [
    'M15.8333 4.16675H4.16667C3.24619 4.16675 2.5 4.91294 2.5 5.83341V15.8334C2.5 16.7539 3.24619 17.5001 4.16667 17.5001H15.8333C16.7538 17.5001 17.5 16.7539 17.5 15.8334V5.83341C17.5 4.91294 16.7538 4.16675 15.8333 4.16675Z',
    'M13.3333 2.5V5.83333',
    'M6.66666 2.5V5.83333',
    'M2.5 8.33325H17.5',
  ],
  category: [
    'M2.5 9.99992V3.33325H9.16667L17.5 11.6666L10.8333 18.3333L2.5 9.99992Z',
    'M6.25 7.5C6.94036 7.5 7.5 6.94036 7.5 6.25C7.5 5.55964 6.94036 5 6.25 5C5.55964 5 5 5.55964 5 6.25C5 6.94036 5.55964 7.5 6.25 7.5Z',
  ],
  account: [
    'M15.8333 5H4.16667C3.24619 5 2.5 5.74619 2.5 6.66667V15C2.5 15.9205 3.24619 16.6667 4.16667 16.6667H15.8333C16.7538 16.6667 17.5 15.9205 17.5 15V6.66667C17.5 5.74619 16.7538 5 15.8333 5Z',
    'M2.5 8.33325H17.5',
    'M13.3333 12.5H15',
  ],
  edit: ['M13.75 2.91675L17.0833 6.25008L6.66666 16.6667H3.33333V13.3334L13.75 2.91675Z'],
  'chevron-down': ['M5 7.5L10 12.5L15 7.5'],
  sparkle: ['M10 2.5L11.5833 7.16667L16.25 8.75L11.5833 10.3333L10 15L8.41667 10.3333L3.75 8.75L8.41667 7.16667L10 2.5Z'],
  info: [
    'M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z',
    'M10 9.16675V13.3334',
    'M10 6.66675H10.0083',
  ],
  x: ['M15 5L5 15', 'M5 5L15 15'],
  check: ['M16.6667 5L7.50004 14.1667L3.33337 10'],
} as const

export type IconName = keyof typeof paths

export interface IconProps {
  /** Icon from the Figma set, e.g. "amount" for icon/amount. */
  name: IconName
  /** Pixel size. Figma: size/icon/md = 20 (default), size/icon/sm = 16. */
  size?: 16 | 20 | 24
  className?: string
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.66667}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
