import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import type { SelectGroup, SelectOption } from './Select';
import { ArrowDownIcon, ArrowUpIcon, SwapIcon } from '../../icons';

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
