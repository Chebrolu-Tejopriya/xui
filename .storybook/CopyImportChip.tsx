import { useState } from 'react';

/** Single source of truth for the package name shown in copy chips. */
export const PACKAGE_NAME = 'xui';

/**
 * Storybook-only chip rendered above every component story: shows the
 * component's import statement and copies it on click, so a consumer (human
 * or agent) can paste it straight into an application.
 */
export function CopyImportChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API can be unavailable (http, permissions); fall back.
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
        padding: '6px 8px 6px 12px',
        width: 'fit-content',
        maxWidth: '100%',
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 6,
      }}
    >
      <code
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
          fontSize: 12,
          color: 'var(--content-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {code}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy import statement"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 8px',
          border: 'none',
          borderRadius: 4,
          background: copied ? 'var(--surface-success-tertiary)' : 'var(--surface-secondary)',
          color: copied ? 'var(--content-success-secondary)' : 'var(--content-secondary)',
          font: 'var(--type-subtitle-3)',
          cursor: 'pointer',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
