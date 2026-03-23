/**
 * PaketJet — Tailwind CSS Preset
 *
 * ⚠️  TAILWIND v3 FORMAT — Referans amaçlıdır.
 * frontend/ klasörü Tailwind v4 kullanır; v4'te preset yerine
 * globals.css içindeki @theme direktifi geçerlidir.
 * → Uygulanan kaynak: frontend/src/app/globals.css
 *
 * --- Tailwind v3 preset (referans) ---
 * Kullanım (tailwind.config.ts):
 *   import paketjetPreset from '@/design/tailwind-preset'
 *   export default { presets: [paketjetPreset], content: [...] }
 *
 * Token renkleri CSS custom property olarak tanımlanır.
 * Opacity modifier tam desteklenir: bg-brand/80, text-navy/60 vb.
 *
 * Dark mode: attribute stratejisi → <html data-theme="dark">
 */

import type { Config } from 'tailwindcss'

const paketjetPreset: Omit<Config, 'content'> = {
  darkMode: ['selector', '[data-theme="dark"]'],

  theme: {
    extend: {
      // ── Renkler ────────────────────────────────────────────────────
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--col-brand) / <alpha-value>)',
          dark:    'hsl(var(--col-brand-dark) / <alpha-value>)',
          light:   'hsl(var(--col-brand-light) / <alpha-value>)',
          xlight:  'hsl(var(--col-brand-xlight) / <alpha-value>)',
        },
        navy: {
          DEFAULT: 'hsl(var(--col-navy) / <alpha-value>)',
          mid:     'hsl(var(--col-navy-mid) / <alpha-value>)',
          soft:    'hsl(var(--col-navy-soft) / <alpha-value>)',
        },
        text: {
          DEFAULT: 'hsl(var(--col-text) / <alpha-value>)',
          muted:   'hsl(var(--col-text-muted) / <alpha-value>)',
          faint:   'hsl(var(--col-text-faint) / <alpha-value>)',
        },
        surface:  'hsl(var(--col-surface) / <alpha-value>)',
        border: {
          DEFAULT: 'hsl(var(--col-border) / <alpha-value>)',
          soft:    'hsl(var(--col-border-soft) / <alpha-value>)',
        },
        bg: {
          DEFAULT: 'hsl(var(--col-bg) / <alpha-value>)',
          alt:     'hsl(var(--col-bg-alt) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--col-success) / <alpha-value>)',
          bg:      'hsl(var(--col-success-bg) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--col-warning) / <alpha-value>)',
          bg:      'hsl(var(--col-warning-bg) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'hsl(var(--col-danger) / <alpha-value>)',
          bg:      'hsl(var(--col-danger-bg) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'hsl(var(--col-info) / <alpha-value>)',
          bg:      'hsl(var(--col-info-bg) / <alpha-value>)',
        },
      },

      // ── Tipografi ──────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem',     { lineHeight: '1.5rem' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',  { lineHeight: '2rem' }],
        '3xl': ['2rem',    { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.5rem',  { lineHeight: '3rem',   letterSpacing: '-0.02em' }],
        'hero': ['3.5rem', { lineHeight: '1.1',    letterSpacing: '-0.03em' }],
      },

      // ── Border Radius ──────────────────────────────────────────────
      borderRadius: {
        sm:   '0.25rem',
        md:   '0.5rem',
        lg:   '0.75rem',
        xl:   '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },

      // ── Box Shadow ─────────────────────────────────────────────────
      boxShadow: {
        xs:    'var(--shadow-xs)',
        sm:    'var(--shadow-sm)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        brand: 'var(--shadow-brand)',
      },

      // ── Spacing ────────────────────────────────────────────────────
      // Tailwind'in varsayılan spacing'ine ek olarak semantik adlar
      spacing: {
        '18': '4.5rem',   /* 72px */
        '22': '5.5rem',   /* 88px */
        '26': '6.5rem',   /* 104px */
        '30': '7.5rem',   /* 120px */
      },

      // ── Geçiş ──────────────────────────────────────────────────────
      transitionDuration: {
        fast:   '100ms',
        base:   '150ms',
        slow:   '250ms',
        layout: '300ms',
      },

      // ── Z-Index ────────────────────────────────────────────────────
      zIndex: {
        dropdown: '10',
        sticky:   '20',
        overlay:  '30',
        modal:    '40',
        toast:    '50',
      },

      // ── Ekran genişlikleri ─────────────────────────────────────────
      screens: {
        xs: '480px',
        // sm: 640px  (Tailwind default)
        // md: 768px
        // lg: 1024px
        // xl: 1280px
        // 2xl: 1536px
      },

      // ── Animasyonlar ───────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsl(27 96% 53% / 0.4)' },
          '50%':       { boxShadow: '0 0 0 8px hsl(27 96% 53% / 0)' },
        },
      },

      animation: {
        'fade-in':        'fade-in 200ms ease forwards',
        'slide-in-right': 'slide-in-right 200ms ease forwards',
        'scale-in':       'scale-in 150ms ease forwards',
        'pulse-brand':    'pulse-brand 2s ease infinite',
      },
    },
  },

  plugins: [],
}

export default paketjetPreset
