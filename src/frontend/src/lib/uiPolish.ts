/**
 * Shared UI polish constants and helpers for consistent styling
 * across Premium, Share, and Notifications surfaces.
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
