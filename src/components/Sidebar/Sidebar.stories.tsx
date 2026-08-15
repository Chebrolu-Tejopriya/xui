import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarFooter,
  SidebarItem,
  SidebarSubItem,
} from './Sidebar';
import { KoinXWordmark, KoinXMark } from '../../assets/brand';
import {
  OverviewIcon,
  WalletIcon,
  TransactionsIcon,
  JournalIcon,
  ItemsIcon,
  PercentageIcon,
  PurchasesIcon,
  GuideListIcon,
  TaxesIcon,
  RulesIcon,
  SettingsIcon,
  SyncIcon,
  DayIcon,
  NightIcon,
  ComputerIcon,
} from '../../icons';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
};
export default meta;

/** The KoinX nav, mapped onto Icons v2 (see the Sidebar docs for the mapping). */
const NAV = [
  { id: 'home', label: 'Home', icon: OverviewIcon },
  { id: 'sources', label: 'Data Sources', icon: WalletIcon, sub: ['Connected apps', 'Imports'] },
  { id: 'txns', label: 'Transactions', icon: TransactionsIcon },
  { id: 'journals', label: 'Journals', icon: JournalIcon },
  { id: 'items', label: 'Items', icon: ItemsIcon },
  { id: 'sales', label: 'Sales', icon: PercentageIcon, sub: ['Invoices', 'Customers', 'Payments'] },
  { id: 'purchases', label: 'Purchases', icon: PurchasesIcon, sub: ['Bills', 'Vendors', 'Expenses'] },
  { id: 'coa', label: 'Chart of Accounts', icon: GuideListIcon },
  { id: 'reports', label: 'Reports', icon: TaxesIcon },
  { id: 'automation', label: 'Automation', icon: RulesIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, sub: ['General', 'Team', 'Billing'] },
] as const;

function Logo({ collapsed }: { collapsed: boolean }) {
  return collapsed ? <KoinXMark /> : <KoinXWordmark />;
}

function ThemeSwitch() {
  const [mode, setMode] = useState<'system' | 'light' | 'dark'>('light');
  const opts = [
    { k: 'system', Icon: ComputerIcon },
    { k: 'light', Icon: DayIcon },
    { k: 'dark', Icon: NightIcon },
  ] as const;
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 2,
        padding: 2,
        borderRadius: 'var(--radius-max)',
        background: 'var(--surface-secondary)',
      }}
    >
      {opts.map(({ k, Icon }) => (
        <button
          key={k}
          type="button"
          onClick={() => setMode(k)}
          aria-label={k}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 24,
            border: 'none',
            borderRadius: 'var(--radius-max)',
            cursor: 'pointer',
            background: mode === k ? 'var(--surface-raised)' : 'transparent',
            color: mode === k ? 'var(--content-brand-primary)' : 'var(--content-tertiary)',
          }}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

function Demo({ startCollapsed = false }: { startCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [active, setActive] = useState<string>('home');
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--surface-primary)' }}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)}>
        <SidebarHeader>
          <Logo collapsed={collapsed} />
        </SidebarHeader>

        <SidebarNav>
          {NAV.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              selected={active === item.id}
              onClick={() => setActive(item.id)}
            >
              {'sub' in item && item.sub
                ? item.sub.map((s) => <SidebarSubItem key={s} label={s} />)
                : undefined}
            </SidebarItem>
          ))}
        </SidebarNav>

        <SidebarFooter>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              font: 'var(--type-body-3)',
              color: 'var(--content-tertiary)',
              whiteSpace: 'nowrap',
            }}
          >
            <SyncIcon size={16} variant="dualtone" />
            {!collapsed && <>Last synced: 2 weeks ago</>}
          </span>
          {!collapsed && <ThemeSwitch />}
        </SidebarFooter>
      </Sidebar>

      <main style={{ flex: 1, padding: 24, font: 'var(--type-body-2)', color: 'var(--content-secondary)' }}>
        Page content — use the tab on the sidebar edge to collapse it.
      </main>
    </div>
  );
}

/** Full navigation rail — click items to select, use the edge tab to collapse. */
export const Playground: StoryObj = {
  render: () => <Demo />,
  parameters: { docs: { source: { type: 'code' } } },
};

/** The 61px icon-only rail. */
export const Collapsed: StoryObj = {
  render: () => <Demo startCollapsed />,
  parameters: { docs: { source: { type: 'code' } } },
};

/** Item states side by side: default, selected, hover (hover the third), and a sub-list. */
export const States: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 24, background: 'var(--surface-primary)' }}>
      <Sidebar defaultOpenId="With sub-items" style={{ height: 'auto' }}>
        <SidebarNav>
          <SidebarItem icon={OverviewIcon} label="Default" />
          <SidebarItem icon={OverviewIcon} label="Selected" selected />
          <SidebarItem icon={OverviewIcon} label="Hover me" />
          <SidebarItem icon={PurchasesIcon} label="With sub-items">
            <SidebarSubItem label="Bills" selected />
            <SidebarSubItem label="Vendors" />
          </SidebarItem>
        </SidebarNav>
      </Sidebar>
      <Sidebar collapsed style={{ height: 'auto' }}>
        <SidebarNav>
          <SidebarItem icon={OverviewIcon} label="Default" />
          <SidebarItem icon={WalletIcon} label="Selected" selected />
          <SidebarItem icon={TransactionsIcon} label="Hover for flyout">
            <SidebarSubItem label="Integrations" selected />
            <SidebarSubItem label="Treasury Accounts" />
          </SidebarItem>
        </SidebarNav>
      </Sidebar>
    </div>
  ),
  parameters: { docs: { source: { type: 'code' } } },
};
