import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    safelist: [
      // Color utilities
      'bg-primary',
      'text-primary-foreground',
      'bg-secondary',
      'text-secondary-foreground',
      'bg-destructive',
      'text-destructive-foreground',
      'bg-muted',
      'text-muted-foreground',
      'bg-accent',
      'text-accent-foreground',
      'bg-background',
      'text-foreground',
      'border-primary',
      'border-secondary',
      'border-input',
      'border-border',
      // Hover states
      'hover:bg-primary',
      'hover:bg-primary/90',
      'hover:bg-secondary',
      'hover:bg-secondary/80',
      'hover:bg-destructive',
      'hover:bg-destructive/90',
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'hover:underline',
      // Focus states
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      // Button-specific classes
      'shadow',
      'shadow-sm',
      'underline-offset-4',
      // Disabled states
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      // Animation classes for onboarding
      'animate-slide-in-right',
      'animate-slide-in-left',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border) / <alpha-value>)',
                input: 'oklch(var(--input) / <alpha-value>)',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background) / <alpha-value>)',
                foreground: 'oklch(var(--foreground) / <alpha-value>)',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground) / <alpha-value>)'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground) / <alpha-value>)'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
                    foreground: 'oklch(var(--popover-foreground) / <alpha-value>)'
                },
                card: {
                    DEFAULT: 'oklch(var(--card) / <alpha-value>)',
                    foreground: 'oklch(var(--card-foreground) / <alpha-value>)'
                },
                success: {
                    DEFAULT: 'oklch(var(--success) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground) / <alpha-value>)'
                },
                warning: {
                    DEFAULT: 'oklch(var(--warning) / <alpha-value>)',
                    foreground: 'oklch(var(--warning-foreground) / <alpha-value>)'
                },
                chart: {
                    1: 'oklch(var(--chart-1) / <alpha-value>)',
                    2: 'oklch(var(--chart-2) / <alpha-value>)',
                    3: 'oklch(var(--chart-3) / <alpha-value>)',
                    4: 'oklch(var(--chart-4) / <alpha-value>)',
                    5: 'oklch(var(--chart-5) / <alpha-value>)'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar) / <alpha-value>)',
                    foreground: 'oklch(var(--sidebar-foreground) / <alpha-value>)',
                    primary: 'oklch(var(--sidebar-primary) / <alpha-value>)',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground) / <alpha-value>)',
                    accent: 'oklch(var(--sidebar-accent) / <alpha-value>)',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground) / <alpha-value>)',
                    border: 'oklch(var(--sidebar-border) / <alpha-value>)',
                    ring: 'oklch(var(--sidebar-ring) / <alpha-value>)'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                },
                'slide-in-right': {
                    from: {
                        opacity: '0',
                        transform: 'translateX(20px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                },
                'slide-in-left': {
                    from: {
                        opacity: '0',
                        transform: 'translateX(-20px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-in-left': 'slide-in-left 0.3s ease-out'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
