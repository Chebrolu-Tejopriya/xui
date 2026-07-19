/** Shared inline SVG icons for Input-family Storybook stories. */

export const InfoIcon = (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7.5V11M8 5.4v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Figma Icons/warning_amber — filled triangle used by error-state helper rows. */
export const WarningIcon = (
  <svg viewBox="0 0 16 16" fill="none">
    <path
      d="M7.33 2.66 12.35 11.33H2.31L7.33 2.66ZM7.33 0 0 12.67h14.67L7.33 0ZM8 9.33H6.67v1.34H8V9.33ZM8 5.33H6.67V8H8V5.33Z"
      transform="translate(0.667 1.667)"
      fill="currentColor"
    />
  </svg>
);

export const IndiaFlag = (
  <svg viewBox="0 0 24 24">
    <rect width="24" height="8" y="0" fill="#FF9933" />
    <rect width="24" height="8" y="8" fill="#FFFFFF" />
    <rect width="24" height="8" y="16" fill="#138808" />
    <circle cx="12" cy="12" r="2.2" fill="none" stroke="#000080" strokeWidth="0.5" />
  </svg>
);

export const UsdIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#0052fe" />
    <text x="12" y="16" fontSize="12" fill="white" textAnchor="middle" fontFamily="Inter, sans-serif">
      $
    </text>
  </svg>
);

export const EthIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#627eea" />
    <path d="M12 4v6.2L17.5 13 12 4Z" fill="white" fillOpacity="0.7" />
    <path d="M12 4 6.5 13 12 10.2V4Z" fill="white" />
    <path d="M12 15.4v4.6l5.5-7.6-5.5 3Z" fill="white" fillOpacity="0.7" />
    <path d="M12 20v-4.6L6.5 12.4 12 20Z" fill="white" />
  </svg>
);

export const InrIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#ff9933" />
    <text x="12" y="16" fontSize="12" fill="white" textAnchor="middle" fontFamily="Inter, sans-serif">
      ₹
    </text>
  </svg>
);

export const BtcIcon = (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#f7931a" />
    <text x="12" y="16" fontSize="12" fill="white" textAnchor="middle" fontFamily="Inter, sans-serif">
      ₿
    </text>
  </svg>
);

export const UsFlag = (
  <svg viewBox="0 0 24 24">
    <rect width="24" height="24" fill="#B22234" />
    {[0, 2, 4, 6, 8, 10].map((y) => (
      <rect key={y} width="24" height="1.85" y={y * 1.85} fill="white" />
    ))}
    <rect width="10" height="12.9" fill="#3C3B6E" />
  </svg>
);
