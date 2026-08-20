/* ============================================================================
 * XUI PLAYGROUND — this file is yours. Edit it freely.
 *
 * Everything comes from the design system through one import, exactly the way
 * the team consumes it. Nothing you do in here can change XUI: this file is
 * not scanned by the manifest, the parity gates or the component docs.
 *
 *   npm run dev      -> http://localhost:5173
 *
 * If something you need isn't exported from 'xui', that's a real gap in the
 * public surface — say so rather than importing from 'src/components/…'.
 * ========================================================================== */

import { useState } from 'react';
import {
  AppShell, AppShellMain,
  Sidebar, SidebarHeader, SidebarNav, SidebarFooter, SidebarItem, SidebarSubItem,
  Button, Badge, Input,
  KoinXWordmark, KoinXMark,
  OverviewIcon, WalletIcon, TransactionsIcon, SettingsIcon,
  DayIcon, NightIcon,
} from 'xui';

/* -- nav: rename, add, remove. Purely playground scaffolding. --------------- */
const NAV = [
  { id: 'home', label: 'Dashboard', icon: OverviewIcon },
  { id: 'sources', label: 'Data Sources', icon: WalletIcon, sub: ['Connected apps', 'Imports'] },
  { id: 'txns', label: 'Transactions', icon: TransactionsIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, sub: ['General', 'Team'] },
] as const;

export default function Playground() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

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
          <Button variant="ghost" size="small" onClick={toggleTheme}>
            {dark ? <NightIcon size={16} /> : <DayIcon size={16} />}
            {!collapsed && (dark ? 'Dark' : 'Light')}
          </Button>
        </SidebarFooter>
      </Sidebar>

      <AppShellMain>
        {/* ==================================================================
            BUILD HERE. Delete everything below and start.
            ================================================================== */}
        <h1 style={{ font: 'var(--type-heading-2)', color: 'var(--content-primary)', margin: 0 }}>
          Playground
        </h1>
        <p style={{ font: 'var(--type-body-2)', color: 'var(--content-secondary)', margin: 0 }}>
          Compose XUI components here. The shell around you is the real one.
        </p>

        <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Badge variant="label-info">Pending</Badge>
          <Badge variant="label-positive">License</Badge>
        </div>

        <div style={{ maxWidth: 320 }}>
          <Input label="Client name" placeholder="Search…" />
        </div>
      </AppShellMain>
    </AppShell>
  );
}
