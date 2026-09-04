import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import type { SelectGroup, SelectOption } from './Select';
import { ArrowDownIcon, ArrowForwardIcon, ArrowUpIcon, SwapIcon } from '../../icons';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  decorators: [(Story) => <div style={{ minHeight: 340 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Select>;

const FLAT: SelectOption[] = [
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'sol', label: 'Solana' },
  { value: 'ada', label: 'Cardano', disabled: true },
];

/** Figma draws the panel with titled runs separated by a rule — 583:4488. */
const GROUPED: SelectGroup[] = [
  {
    label: 'Assets',
    options: [
      { value: 'cash', label: 'Cash' },
      { value: 'bank', label: 'Bank' },
      { value: 'fixed', label: 'Fixed Asset' },
    ],
  },
  {
    label: 'Income',
    options: [
      { value: 'sales', label: 'Sales Revenue' },
      { value: 'commission', label: 'Commission Income' },
      { value: 'interest', label: 'Interest Income' },
    ],
  },
];

export const Playground: Story = { args: { options: FLAT } };

/** The headline case: titled groups, each run separated by a rule. */
export const WithGroupedOptions: Story = { args: { options: GROUPED } };

/** Type to filter. A group whose options all filter out takes its heading with it. */
export const WithSearchInput: Story = {
  args: { options: GROUPED, searchInput: true },
};

/** `keywords` widens what a row matches beyond its visible label — try "btc". */
export const WithCustomSearchKeywords: Story = {
  args: {
    searchInput: true,
    options: [
      { value: 'btc', label: 'Bitcoin', keywords: ['btc', 'xbt'] },
      { value: 'eth', label: 'Ethereum', keywords: ['eth', 'ether'] },
      { value: 'sol', label: 'Solana', keywords: ['sol'] },
    ],
  },
};

/** A quieter second line under each label. */
export const WithSubLabelInOptions: Story = {
  args: {
    options: FLAT.map((o) => ({ ...o, subLabel: 'Cryptocurrency' })),
  },
};

export const OptionsWithIconsOnLeft: Story = {
  args: {
    options: [
      { value: 'deposit', label: 'Deposit', icon: <ArrowDownIcon size={16} /> },
      { value: 'transfer', label: 'Transfer', icon: <ArrowUpIcon size={16} /> },
      { value: 'swap', label: 'Swap', icon: <SwapIcon size={16} /> },
    ],
  },
};

export const OptionsWithImageOnLeft: Story = {
  args: {
    options: FLAT.slice(0, 3).map((o) => ({
      ...o,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E" +
        "%3Ccircle cx='10' cy='10' r='10' fill='%230052fe'/%3E%3C/svg%3E",
    })),
  },
};

/** Without the check, rows lose the 32px inset that was holding room for it. */
export const WithNoCheckIcon: Story = {
  args: { options: FLAT, check: false, defaultValue: 'eth' },
};

/** Sorted by label rather than kept in the order given. */
export const WithSortedOptions: Story = {
  args: { options: FLAT, sortedOptions: true },
};

/** Figma's trigger is 204px; anything else is this prop. */
export const WithCustomWidth: Story = {
  args: { options: FLAT, width: '320px' },
};

/**
 * The cross replaces the chevron once a non-default value is chosen, and
 * clearing returns to the default rather than to nothing.
 */
export const WithCrossIcon: Story = {
  args: { options: FLAT, isClearable: true, defaultValue: 'btc' },
};

export const Selected: Story = { args: { options: FLAT, defaultValue: 'eth' } };
export const Loading: Story = { args: { options: FLAT, loading: true } };
export const Disabled: Story = { args: { options: FLAT, disabled: true } };

/* ---- Nesting, trigger and option icons, creation ---- */

/** Figma's nested dropdown: a group heading, rows, and bulleted children beneath them. */
const NESTED: SelectGroup[] = [
  {
    label: 'Assets',
    options: [
      { value: 'other-asset', label: 'Other Asset' },
      {
        value: 'other-current',
        label: 'Other Current Asset',
        options: [{ value: 'asset-123', label: 'Asset 123' }],
      },
      { value: 'cash', label: 'Cash' },
      {
        value: 'bank',
        label: 'Bank',
        options: [{ value: 'descriptions', label: 'Descriptions' }],
      },
      { value: 'fixed-asset', label: 'Fixed Asset' },
    ],
  },
];

export const WithNestedOptions: Story = {
  args: { options: NESTED, searchInput: true },
};

/**
 * Headings with no rows of their own. Searching still removes a heading whose
 * children all filter out, so nothing is left labelling an empty run.
 */
export const WithJustHeadings: Story = {
  args: {
    searchInput: true,
    options: [
      { label: 'Operating', options: [{ value: 'a', label: 'Lorem ipsum' }, { value: 'b', label: 'Lorem ipsum dolor colon' }] },
      { label: 'Financing', options: [{ value: 'c', label: 'Sales Revenue' }, { value: 'd', label: 'Commission Income' }] },
    ] satisfies SelectGroup[],
  },
};

/** The trigger's chevron replaced. */
export const CustomRightIcon: Story = {
  args: { options: FLAT, iconRight: <ArrowForwardIcon size={16} /> },
};

/** A glyph at the end of every row that does not carry its own. */
export const CustomRightIconForOptions: Story = {
  args: { options: FLAT, optionItemRightIcon: <ArrowForwardIcon size={16} /> },
};

/** Type something absent and the panel offers to take it anyway. */
export const WithCustomOptionCreationAllowed: Story = {
  args: { options: FLAT, searchInput: true, isCustomOptionCreationAllowed: true },
};

/**
 * The query is wiped on close rather than kept for next time.
 *
 * There is nothing to see standing still — the panel has no close control, so
 * the behaviour only shows in a sequence. The story spells it out because a
 * name alone ("With Clear Search On Close") describes something you cannot
 * observe, which is how this shipped broken: clicking away and Escape both
 * bypassed the clearing, and only picking an option ran it.
 */
export const WithClearSearchOnClose: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
      <ol
        style={{
          margin: 0,
          paddingLeft: 'var(--spacing-20)',
          font: 'var(--type-body-2)',
          color: 'var(--content-secondary)',
        }}
      >
        <li>Open it and type into Search.</li>
        <li>Close it — click away, press Escape, or pick a row.</li>
        <li>Open it again: the query is gone. Compare with "With Search Input", which keeps it.</li>
      </ol>
      <Select {...args} />
    </div>
  ),
  args: { options: GROUPED, searchInput: true, clearSearchOnClose: true },
};

/**
 * Figma's `select` set (600:7833) carries Size=[Large|Medium]; XUI shipped only
 * Large until the variant-axis gate found it. Medium is the filter-bar height —
 * and it is not just shorter: its value line drops from 20 to 16, which is what
 * lets Figma's own 10/12 padding land on 36.
 */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)', maxWidth: 320 }}>
      <label style={{ font: 'var(--type-body-3)', color: 'var(--content-secondary)' }}>
        large — 44px, the default
        <Select {...args} size="large" />
      </label>
      <label style={{ font: 'var(--type-body-3)', color: 'var(--content-secondary)' }}>
        medium — 36px
        <Select {...args} size="medium" />
      </label>
    </div>
  ),
  args: { options: FLAT, placeholder: 'Select an option' },
};
