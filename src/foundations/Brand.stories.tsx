import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  KoinXMark,
  KoinXWordmark,
  KoinXProfessionalsWordmark,
  KoinXTaxesWordmark,
} from '../assets/brand';

const meta: Meta = {
  title: 'Foundations/Brand',
  parameters: { copyImport: "import { KoinXWordmark } from '@koinx/xui';" },
};
export default meta;

/**
 * Every lockup, at its Figma size. These carry fixed brand colours rather than
 * tokens (see the `xui-lint-ignore-file` marker in brand.tsx) — the blue and
 * orange are the brand's, not the theme's, and must not invert in dark mode.
 * The wordmark text does change: it is drawn in the palette's darkest grey,
 * which is why each lockup is shown against both surfaces below.
 */
const LOCKUPS = [
  { name: 'KoinXMark', node: '—', size: '21×20', El: KoinXMark },
  { name: 'KoinXWordmark', node: '—', size: '147×20', El: KoinXWordmark },
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

/**
 * The two lockups Figma exported with identical gradient ids
 * (`paint0..5_linear_9677_261004`). SVG ids are document-global, so rendered
 * together the second would silently adopt the first's gradients — the orange
 * X would take the wrong ramp. They are namespaced `_kxpro` / `_kxtax`, and
 * this story is what proves it: both must show the same orange.
 */
export const GradientIsolation: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      <KoinXProfessionalsWordmark />
      <KoinXTaxesWordmark />
    </div>
  ),
};
