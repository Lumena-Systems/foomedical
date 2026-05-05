// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { ButtonHTMLAttributes, CSSProperties, JSX, ReactNode, SVGProps } from 'react';
import { useState } from 'react';
import { ICONS  } from './icons';
import type {IconName} from './icons';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'd'> & {
  d: string | readonly string[];
  size?: number;
};

export function Icon({ d, size = 20, style, ...rest }: IconProps): JSX.Element {
  const paths = Array.isArray(d) ? d : [d as string];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

type BtnVariant = 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';

type BtnProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: IconName;
  iconRight?: IconName;
  type?: 'button' | 'submit' | 'reset';
};

const BTN_SIZES: Record<BtnSize, { h: number; px: number; fs: number }> = {
  sm: { h: 28, px: 12, fs: 13 },
  md: { h: 36, px: 16, fs: 14 },
  lg: { h: 44, px: 20, fs: 15 },
};

const BTN_VARIANTS: Record<BtnVariant, { bg: string; color: string; border: string; hover: string }> = {
  primary: { bg: 'var(--twilight-500)', color: 'var(--paper-50)', border: 'transparent', hover: 'var(--twilight-600)' },
  ink: { bg: 'var(--ink-900)', color: 'var(--paper-50)', border: 'transparent', hover: 'var(--ink-800)' },
  secondary: { bg: 'var(--paper-0)', color: 'var(--fg-primary)', border: 'var(--border-default)', hover: 'var(--paper-100)' },
  ghost: { bg: 'transparent', color: 'var(--fg-primary)', border: 'transparent', hover: 'var(--paper-200)' },
  danger: { bg: 'var(--paper-0)', color: 'var(--danger)', border: 'var(--border-default)', hover: 'var(--danger-bg)' },
};

export function Btn({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  type = 'button',
  style,
  ...rest
}: BtnProps): JSX.Element {
  const sizes = BTN_SIZES[size];
  const variants = BTN_VARIANTS[variant];
  const [hover, setHover] = useState(false);
  const iconSize = size === 'sm' ? 14 : 16;
  return (
    <button
      type={type}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: sizes.h,
        padding: `0 ${sizes.px}px`,
        borderRadius: 4,
        fontSize: sizes.fs,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        border: `1px solid ${variants.border}`,
        background: hover ? variants.hover : variants.bg,
        color: variants.color,
        fontFamily: 'var(--font-sans)',
        transition:
          'background 120ms cubic-bezier(0.2,0,0,1), border-color 120ms cubic-bezier(0.2,0,0,1)',
        ...style,
      }}
    >
      {icon && <Icon d={ICONS[icon]} size={iconSize} />}
      {children}
      {iconRight && <Icon d={ICONS[iconRight]} size={iconSize} />}
    </button>
  );
}

type PillTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'ai';

const PILL_TONES: Record<PillTone, { bg: string; color: string; dot: string; border?: string }> = {
  neutral: { bg: 'var(--bg-subtle)', color: 'var(--fg-secondary)', dot: 'var(--paper-500)' },
  success: { bg: 'var(--success-bg)', color: 'var(--success)', dot: 'var(--success)' },
  warning: { bg: 'var(--warning-bg)', color: 'oklch(0.45 0.12 65)', dot: 'var(--warning)' },
  danger: { bg: 'var(--danger-bg)', color: 'var(--danger)', dot: 'var(--danger)' },
  info: { bg: 'var(--info-bg)', color: 'var(--info)', dot: 'var(--info)' },
  ai: { bg: 'var(--ai-bg)', color: 'var(--ai-fg)', dot: 'var(--lantern-500)', border: 'var(--ai-border)' },
};

export function Pill({
  tone = 'neutral',
  dot = true,
  children,
}: {
  tone?: PillTone;
  dot?: boolean;
  children: ReactNode;
}): JSX.Element {
  const tones = PILL_TONES[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 500,
        padding: '2px 10px',
        borderRadius: 999,
        background: tones.bg,
        color: tones.color,
        border: `1px solid ${tones.border ?? 'transparent'}`,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: tones.dot,
            flex: '0 0 6px',
          }}
        />
      )}
      {children}
    </span>
  );
}

type CardProps = {
  children: ReactNode;
  padding?: number | string;
  hoverable?: boolean;
  style?: CSSProperties;
};

export function Card({ children, padding = 20, hoverable = false, style }: CardProps): JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hover && hoverable ? 'var(--border-default)' : 'var(--border-quiet)'}`,
        borderRadius: 4,
        padding,
        transition: 'border-color 120ms cubic-bezier(0.2,0,0,1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }): JSX.Element {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.10em',
        color: 'var(--fg-muted)',
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type AvatarTone = 'neutral' | 'twilight' | 'ink';

const AVATAR_TONES: Record<AvatarTone, { bg: string; color: string }> = {
  neutral: { bg: 'var(--paper-200)', color: 'var(--fg-primary)' },
  twilight: { bg: 'var(--twilight-100)', color: 'var(--twilight-800)' },
  ink: { bg: 'var(--ink-900)', color: 'var(--paper-50)' },
};

export function Avatar({
  initials,
  size = 28,
  tone = 'neutral',
}: {
  initials: string;
  size?: number;
  tone?: AvatarTone;
}): JSX.Element {
  const tones = AVATAR_TONES[tone];
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: tones.bg,
        color: tones.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

export function LogoMark({ size = 24, color }: { size?: number; color?: string }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ color, flexShrink: 0 }}>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.45" />
      <circle cx="32" cy="32" r="9" fill="currentColor" />
    </svg>
  );
}

export function LogoLockup({ height = 24, color }: { height?: number; color?: string }): JSX.Element {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color }}>
      <LogoMark size={height} />
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: height * 0.95,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: 'currentColor',
        }}
      >
        Lumena
      </span>
    </span>
  );
}
