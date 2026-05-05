// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Fragment  } from 'react';
import type {JSX} from 'react';
import { NavLink } from 'react-router';
import { Eyebrow } from '../lumena/primitives';

export interface SubMenuProps {
  readonly name: string;
  readonly href: string;
}

export interface SideMenuProps {
  readonly title: string;
  readonly menu: { name: string; href: string; subMenu?: SubMenuProps[] }[];
}

const linkStyle = (isActive: boolean, depth = 0): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  padding: depth ? '0 12px 0 28px' : '0 12px',
  borderRadius: 4,
  fontSize: 13,
  fontWeight: isActive ? 500 : 400,
  color: isActive ? 'var(--ink-900)' : 'var(--fg-secondary)',
  background: isActive ? 'var(--paper-0)' : 'transparent',
  border: isActive ? '1px solid var(--border-quiet)' : '1px solid transparent',
  textDecoration: 'none',
});

export function SideMenu({ title, menu }: SideMenuProps): JSX.Element {
  return (
    <nav
      style={{
        width: 220,
        flexShrink: 0,
        padding: '8px 8px 8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <div style={{ padding: '8px 12px 12px' }}>
        <Eyebrow>{title}</Eyebrow>
      </div>
      {menu.map((item) => (
        <Fragment key={item.href}>
          <NavLink to={item.href} end style={({ isActive }) => linkStyle(isActive)}>
            {item.name}
          </NavLink>
          {item.subMenu?.map((subItem) => (
            <NavLink key={subItem.href} to={subItem.href} style={({ isActive }) => linkStyle(isActive, 1)}>
              {subItem.name}
            </NavLink>
          ))}
        </Fragment>
      ))}
    </nav>
  );
}
