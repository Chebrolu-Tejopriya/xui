import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  KoinXLogo,
  KoinXMark,
  KoinXBooksWordmark,
  KoinXProfessionalsWordmark,
  KoinXTaxesWordmark,
} from '../assets/brand';

const meta: Meta = {
  title: 'Foundations/Brand',
  parameters: { copyImport: "import { KoinXLogo } from '@koinx/xui';" },
};
export default meta;

/**
 * Every lockup, at its Figma size. KoinXLogo is the default; a product lockup
 * is only for a screen that belongs to that product.
 *
 * The X's gold and orange are fixed brand art. The rest follows the theme where
 * Figma binds it: "Koin" is surface-brand-primary, product names are
 * content-primary, and the Books Beta pill is a Badge. Each lockup is shown on
 * both surfaces so one that fails in dark mode shows up here.
 */
const LOCKUPS = [
  { name: 'KoinXLogo', node: '9186:58266', size: '80×20', El: KoinXLogo },
  { name: 'KoinXMark', node: '—', size: '21×20', El: KoinXMark },
  { name: 'KoinXBooksWordmark', node: '9186:58265', size: '148×20', El: KoinXBooksWordmark },
  { name: 'KoinXProfessionalsWordmark', node: '9897:139343', size: '187×24', El: KoinXProfessionalsWordmark },
  { name: 'KoinXTaxesWordmark', node: '9897:126326', size: '96×24', El: KoinXTaxesWordmark },
] as const;

export const Lockups: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-24)' }}>
      {LOCKUPS.map(({ name, node, size, El }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-8)' }}>
            <code style={{ font: 'var(--type-subtitle-3)', color: 'var(--content-primary)' }}>{name}</code>
            <span style={{ font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>
              {size}
              {node !== '—' && ` · Figma ${node}`}
            </span>
          </div>
          {/* Both surfaces side by side: the brand blue and orange are fixed,
              but the wordmark's text is a dark grey, so this is where a
              lockup that fails in dark mode shows up. */}
          <div style={{ display: 'flex', gap: 'var(--spacing-8)' }}>
            {(['--surface-primary', '--surface-raised'] as const).map((surface) => (
              <div
                key={surface}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'var(--spacing-16)',
                  background: `var(${surface})`,
                  border: 'var(--border-width-regular) solid var(--border-secondary)',
                  borderRadius: 'var(--radius-mid)',
                }}
              >
                <El />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
