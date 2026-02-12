/**
 * Shared UI polish constants and helpers for consistent styling
 * across all app surfaces including page layouts, cards, and interactive elements.
 */

// Standard icon sizes for consistent visual hierarchy
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

// Card padding presets for consistent spacing
export const cardPadding = {
  compact: 'p-4',
  default: 'p-6',
  spacious: 'p-8',
} as const;

// Row spacing for list items
export const rowSpacing = {
  tight: 'space-y-2',
  default: 'space-y-4',
  relaxed: 'space-y-6',
} as const;

// Standard button configurations for common actions
export const buttonConfigs = {
  primary: { variant: 'default' as const, size: 'default' as const },
  secondary: { variant: 'outline' as const, size: 'default' as const },
  destructive: { variant: 'destructive' as const, size: 'default' as const },
  ghost: { variant: 'ghost' as const, size: 'icon' as const },
} as const;

// Separator margin presets
export const separatorMargin = {
  tight: 'my-4',
  default: 'my-6',
  relaxed: 'my-8',
} as const;

// Page layout constants for consistent spacing and typography
export const pageLayout = {
  maxWidth: 'max-w-2xl',
  containerPadding: 'px-4',
  topSpacing: 'py-6',
  sectionGap: 'space-y-6',
  titleSize: 'text-2xl',
  titleWeight: 'font-bold',
  titleMargin: 'mb-6',
  subtitleSize: 'text-xl',
  subtitleWeight: 'font-bold',
  subtitleMargin: 'mb-4',
} as const;

// Card elevation tokens for consistent depth
export const cardElevation = {
  flat: '',
  low: 'shadow-sm',
  medium: 'shadow-md',
  high: 'shadow-lg',
} as const;

// Standard border radius for cards and interactive elements
export const cardRadius = {
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-2xl',
} as const;

// Focus ring configuration for accessibility
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// Transition presets respecting reduced motion
export const transitions = {
  colors: 'transition-colors motion-reduce:transition-none',
  transform: 'transition-transform motion-reduce:transition-none',
  all: 'transition-all motion-reduce:transition-none',
  shadow: 'transition-shadow motion-reduce:transition-none',
} as const;
