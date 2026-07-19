import { useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import styles from './FileUpload.module.css';

/* Figma Icons/UploadFile & ant-design:cloud-upload-outlined — brand cloud. */
const CloudUploadIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 18.5a4.5 4.5 0 0 1-.42-8.98 6 6 0 0 1 11.6-1.02A5 5 0 0 1 17.5 18.5H15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21v-8m0 0-3 3m3-3 3 3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Figma attach_file (#64748B = content-tertiary). */
const AttachIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M13.5 5.5v7.7a3.5 3.5 0 1 1-7 0V4.8a2.3 2.3 0 0 1 4.6 0v8.4a1.1 1.1 0 1 1-2.2 0V5.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/* Figma Iconly/delete (#F7324C = content-error-primary). */
const DeleteIcon = (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4.5 5.5h11m-8.5 0V4.2c0-.66.54-1.2 1.2-1.2h3.6c.66 0 1.2.54 1.2 1.2v1.3m-6.75 0 .55 10a1.4 1.4 0 0 0 1.4 1.3h4.6a1.4 1.4 0 0 0 1.4-1.3l.55-10M8.4 8.5v5.5m3.2-5.5V14"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface UploadedFile {
  name: string;
}

export interface FileUploadProps {
  /**
   * Figma variants: `default` — large dropzone card (947:5469-5471);
   * `compact` — labelled 48px row (948:5359-5413).
   */
  variant?: 'default' | 'compact';
  /** Field label above the compact box. */
  label?: ReactNode;
  /** Dropzone heading (default variant). */
  title?: ReactNode;
  /** Supported-files line under the heading (default variant). */
  description?: ReactNode;
  /** Compact dropzone text. */
  compactText?: ReactNode;
  /** Uploaded files to display. */
  files?: UploadedFile[];
  /** Allow selecting multiple files; also switches the Figma layouts. */
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  className?: string;
}

/** XUI File Upload — Figma Default (dropzone card) and Compact variants. */
export function FileUpload({
  variant = 'default',
  label,
  title = 'Click or drag file to this area to upload',
  description,
  compactText = 'Click to upload',
  files = [],
  multiple = false,
  accept,
  disabled = false,
  onFilesSelected,
  onRemove,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) onFilesSelected?.(multiple ? dropped : dropped.slice(0, 1));
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      hidden
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      onChange={(e) => {
        const picked = Array.from(e.target.files ?? []);
        if (picked.length) onFilesSelected?.(picked);
        e.target.value = '';
      }}
    />
  );

  const fileRow = (file: UploadedFile, i: number) => (
    <div key={`${file.name}-${i}`} className={styles.fileRow}>
      <span className={styles.fileMain}>
        <span className={styles.attachIcon}>{AttachIcon}</span>
        <span className={styles.fileName}>{file.name}</span>
      </span>
      <button
        type="button"
        className={styles.deleteButton}
        aria-label={`Remove ${file.name}`}
        disabled={disabled}
        onClick={() => onRemove?.(i)}
      >
        {DeleteIcon}
      </button>
    </div>
  );

  if (variant === 'compact') {
    const showAsFileRow = !multiple && files.length > 0;
    return (
      <div className={[styles.compactRoot, className].filter(Boolean).join(' ')}>
        {label != null && <span className={styles.label}>{label}</span>}
        {showAsFileRow ? (
          /* Figma 948:5370: the box itself becomes a solid-bordered file row. */
          <div className={[styles.compactBox, styles.compactUploaded].join(' ')}>
            {fileRow(files[0], 0)}
          </div>
        ) : (
          <button
            type="button"
            className={[styles.compactBox, styles.compactDrop, dragOver && styles.dragOver]
              .filter(Boolean)
              .join(' ')}
            disabled={disabled}
            onClick={openPicker}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <span className={styles.compactCloud}>{CloudUploadIcon}</span>
            <span className={styles.compactText}>{compactText}</span>
          </button>
        )}
        {multiple && files.length > 0 && (
          <div className={styles.compactList}>{files.map(fileRow)}</div>
        )}
        {input}
      </div>
    );
  }

  const dropzone = (
    <button
      type="button"
      className={[styles.dropzone, dragOver && styles.dragOver].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={openPicker}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <span className={styles.cloud}>{CloudUploadIcon}</span>
      <span className={styles.title}>{title}</span>
      {description != null && <span className={styles.description}>{description}</span>}
    </button>
  );

  /* Figma: single uploaded file lists BELOW the dropzone (947:5509);
     multiple files list ABOVE it (947:5471). */
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {multiple && files.length > 0 && <div className={styles.fileList}>{files.map(fileRow)}</div>}
      {dropzone}
      {!multiple && files.length > 0 && <div className={styles.fileList}>{files.map(fileRow)}</div>}
      {input}
    </div>
  );
}
