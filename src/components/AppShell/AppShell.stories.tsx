import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell, AppShellMain } from './AppShell';
import {
  Sidebar, SidebarHeader, SidebarNav, SidebarFooter, SidebarItem, SidebarSubItem,
} from '../Sidebar';
import { KoinXWordmark, KoinXMark } from '../../assets/brand';
import {
  OverviewIcon, WalletIcon, TransactionsIcon, JournalIcon,
  PurchasesIcon, TaxesIcon, SettingsIcon, SyncIcon,
} from '../../icons';

const meta: Meta<typeof AppShell> = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
};
export default meta;

const NAV = [
  { id: 'home', label: 'Dashboard', icon: OverviewIcon },
  { id: 'sources', label: 'Data Sources', icon: WalletIcon, sub: ['Connected apps', 'Imports'] },
  { id: 'txns', label: 'Transactions', icon: TransactionsIcon },
  { id: 'journals', label: 'Journals', icon: JournalIcon },
  { id: 'purchases', label: 'Purchases', icon: PurchasesIcon, sub: ['Bills', 'Vendors'] },
  { id: 'reports', label: 'Reports', icon: TaxesIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, sub: ['General', 'Team'] },
] as const;

/** Stand-in for content the shell has to frame; not part of the component. */
function Block({ h, label }: { h: number; label: string }) {
  return (
    <div
      style={{
        height: h,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderRadius: 'var(--radius-mid)',
        border: 'var(--border-width-regular) solid var(--border-secondary)',
        background: 'var(--surface-raised)',
        font: 'var(--type-subtitle-2)',
        color: 'var(--content-secondary)',
      }}
    >
      {label}
    </div>
  );
}

function Demo({ startCollapsed = false }: { startCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [active, setActive] = useState('home');
  return (
    <AppShell style={{ height: '100vh' }}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)}>
        <SidebarHeader>{collapsed ? <KoinXMark /> : <KoinXWordmark />}</SidebarHeader>
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-3)', color: 'var(--content-tertiary)', whiteSpace: 'nowrap' }}>
            <SyncIcon size={16} variant="dualtone" />
            {!collapsed && <>Last synced: 2 weeks ago</>}
          </span>
        </SidebarFooter>
      </Sidebar>

      <AppShellMain data-testid="main">
        <Block h={44} label="Page header sits here — 44px in the Professionals mock" />
        <Block h={56} label="Alert / banner row" />
        <Block h={620} label="Page content — the column scrolls, the rail does not" />
        <Block h={400} label="More content, to prove the rail stays put" />
      </AppShellMain>
    </AppShell>
  );
}

/** The shell at the 1440 design width: rail 224, gap 24, content 1168, right gutter 24. */
export const Playground: StoryObj = {
  render: () => <Demo />,
  parameters: { docs: { source: { type: 'code' } } },
};

/** Rail collapsed to 61px; the content column takes the reclaimed width. */
export const Collapsed: StoryObj = {
  render: () => <Demo startCollapsed />,
  parameters: { docs: { source: { type: 'code' } } },
};
