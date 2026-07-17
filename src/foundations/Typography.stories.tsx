import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
};
export default meta;

const styles = [
  ['Heading 0', '--type-heading-0', 'Bold 40/48'],
  ['Heading 1', '--type-heading-1', 'SemiBold 28/36'],
  ['Heading 2', '--type-heading-2', 'SemiBold 24/30'],
  ['Heading 3', '--type-heading-3', 'SemiBold 20/26'],
  ['Heading 4', '--type-heading-4', 'SemiBold 18/24'],
  ['Heading 5', '--type-heading-5', 'SemiBold 16/22'],
  ['Heading 6', '--type-heading-6', 'SemiBold 14/20'],
  ['Subtitle 1', '--type-subtitle-1', 'Medium 16/22'],
  ['Subtitle 2', '--type-subtitle-2', 'Medium 14/20'],
  ['Subtitle 3', '--type-subtitle-3', 'Medium 12/16'],
  ['Subtitle 4', '--type-subtitle-4', 'Medium 11/14'],
  ['Body 0', '--type-body-0', 'Regular 18/28'],
  ['Body 1', '--type-body-1', 'Regular 16/24'],
  ['Body 2', '--type-body-2', 'Regular 14/20'],
  ['Body 3', '--type-body-3', 'Regular 12/16'],
  ['Button 1', '--type-button-1', 'Medium 16/26'],
  ['Button 2', '--type-button-2', 'Medium 14/20'],
  ['Button 3', '--type-button-3', 'Medium 12/16'],
  ['Label 3', '--type-label-3', 'Medium 12/16'],
  ['Label 4', '--type-label-4', 'Regular 10/12'],
];

export const Scale: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {styles.map(([name, token, spec]) => (
        <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <span style={{ width: 160, font: 'var(--type-body-3)', color: 'var(--content-tertiary)' }}>
            {name} · {spec}
          </span>
          <span style={{ font: `var(${token})`, color: 'var(--content-primary)' }}>
            The quick brown fox jumps over the lazy dog
          </span>
        </div>
      ))}
    </div>
  ),
};
