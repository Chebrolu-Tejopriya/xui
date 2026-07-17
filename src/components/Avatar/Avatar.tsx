import { useState } from 'react';
import type { HTMLAttributes } from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source; falls back to initials when missing or broken. */
  src?: string;
  alt?: string;
  /** Initials (or name — first letters of the first two words are used). */
  name?: string;
  size?: AvatarSize;
}

function initialsOf(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export function Avatar({ src, alt = '', name, size = 'md', className, ...rest }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = src != null && !broken;

  return (
    <span
      className={[styles.avatar, styles[size], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt={alt} onError={() => setBroken(true)} />
      ) : (
        <span className={styles.fallback} aria-hidden={alt === '' || undefined}>
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}
