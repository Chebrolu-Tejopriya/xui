/**
 * Compiled against dist/types, never against src.
 *
 * Everything in this repo reads the SOURCE — the playground aliases it, and
 * `npm run typecheck` builds it. So an export that exists in src but never
 * reaches the built package typechecks fine here and fails only for whoever
 * installs it. That is exactly how EmptyStateClassNames shipped unexported.
 *
 * Add a line here whenever a component gains a public type.
 */
import {
  Accordion, AppShell, Avatar, Badge, Breadcrumbs, Button, Checkbox, Dialog,
  Drawer, EmptyState, FileUpload, Input, Pagination, Radio, Select, Sidebar,
  Switch, Table, Tabs, Toast, Tooltip,
  KoinXWordmark, KoinXProfessionalsWordmark, KoinXTaxesWordmark,
  MaintenanceIllustration, ErrorIllustration, NoDataIllustration,
} from '@koinx/xui';
import type {
  ButtonProps, DialogProps, DrawerProps, DrawerPlacement, DrawerClassNames,
  EmptyStateProps, EmptyStateClassNames, InputProps, TableCellProps,
} from '@koinx/xui';

export const components = [
  Accordion, AppShell, Avatar, Badge, Breadcrumbs, Button, Checkbox, Dialog,
  Drawer, EmptyState, FileUpload, Input, Pagination, Radio, Select, Sidebar,
  Switch, Table, Tabs, Toast, Tooltip,
];
export const brand = [KoinXWordmark, KoinXProfessionalsWordmark, KoinXTaxesWordmark];
export const art = [MaintenanceIllustration, ErrorIllustration, NoDataIllustration];

// Types must be usable, not merely exported.
export const drawer: DrawerProps = {
  open: false,
  onClose: () => {},
  placement: 'bottom' satisfies DrawerPlacement,
  classNames: { title: 'x' } satisfies DrawerClassNames,
};
export const empty: EmptyStateProps = {
  title: 'x',
  footer: 'y',
  classNames: { footer: 'z' } satisfies EmptyStateClassNames,
};
export type Checked = [ButtonProps, DialogProps, InputProps, TableCellProps];
