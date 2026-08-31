/**
 * XUI public entry.
 *
 * The one path anything outside the design system imports from:
 *
 *   import { Button, AppShell } from 'xui';
 *
 * Importing this also loads the design tokens, so a consumer gets the whole
 * system from a single line. If something you need is not exported here, that
 * is a real gap in the public surface — widen it deliberately rather than
 * reaching into `src/components/…` internals.
 */
import './tokens/index.css';

export * from './components'; // components, and icons via the components barrel
export * from './assets/brand';
export * from './assets/illustrations';
