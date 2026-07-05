"use client";

import {Button} from 'react-aria-components';
import {Ellipsis, FolderOpen, Pencil, Copy, Trash, Share, Mail, Smartphone, Instagram} from 'lucide-react';
import {Check, ChevronRight, Dot} from 'lucide-react';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  Separator,
  Keyboard,
  type MenuItemProps,
  type MenuProps,
  type MenuSectionProps,
  type MenuTriggerProps,
  type SubmenuTriggerProps
} from 'react-aria-components/Menu';
import {Text} from 'react-aria-components';
import React from 'react';
// @ts-expect-error: allow side-effect CSS import without type declarations
import './ShareButton.scss';

import {
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps
} from 'react-aria-components/Popover';
import clsx from 'clsx';

export interface PopoverProps extends Omit<AriaPopoverProps, 'children'> {
  children: React.ReactNode;
  hideArrow?: boolean;
}

export function Popover({children, hideArrow, ...props}: PopoverProps) {
  return (
    <AriaPopover {...props} className={clsx('react-aria-Popover', props.className)}>
      {({trigger}) => (
        <>
          {!hideArrow && trigger !== 'MenuTrigger' && trigger !== 'SubmenuTrigger' && (
            <OverlayArrow>
              <svg width={12} height={12} viewBox="0 0 12 12">
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </OverlayArrow>
          )}
          {children}
        </>
      )}
    </AriaPopover>
  );
}

export function MenuTrigger(props: MenuTriggerProps) {
  const [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement
  ];
  return (
    <AriaMenuTrigger {...props}>
      {trigger}
      <Popover>{menu}</Popover>
    </AriaMenuTrigger>
  );
}

function Menu<T>(props: MenuProps<T>) {
  return <AriaMenu {...props}>{props.children}</AriaMenu>;
}

function MenuItem(props: Omit<MenuItemProps, 'children'> & {children?: React.ReactNode}) {
  const textValue =
    props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaMenuItem {...props} textValue={textValue}>
      {({hasSubmenu, isSelected, selectionMode}) => (
        <>
          {isSelected && selectionMode === 'multiple' ? <Check /> : null}
          {isSelected && selectionMode === 'single' ? <Dot /> : null}
          {typeof props.children === 'string' ? (
            <Text slot="label">{props.children}</Text>
          ) : (
            props.children
          )}
          {hasSubmenu && <ChevronRight />}
        </>
      )}
    </AriaMenuItem>
  );
}

function MenuSection<T>(props: MenuSectionProps<T>) {
  return <AriaMenuSection {...props} />;
}

function SubmenuTrigger(props: SubmenuTriggerProps) {
  const [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement
  ];
  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover offset={-2} crossOffset={-4}>
        {menu}
      </Popover>
    </AriaSubmenuTrigger>
  );
}

export const ShareButton = () => {
  return (
    <MenuTrigger>
      <Button aria-label="Actions">
        <Ellipsis size={18} />
      </Button>
      <Menu>
        <MenuSection>
          <MenuItem onAction={() => alert('open')}>
            <FolderOpen />
            <Text slot="label">Open</Text>
            <Keyboard>⌘O</Keyboard>
          </MenuItem>
          <MenuItem onAction={() => alert('rename')}>
            <Pencil />
            <Text slot="label">Rename…</Text>
            <Keyboard>⌘R</Keyboard>
          </MenuItem>
          <MenuItem onAction={() => alert('duplicate')}>
            <Copy />
            <Text slot="label">Duplicate</Text>
            <Keyboard>⌘D</Keyboard>
          </MenuItem>
          <MenuItem onAction={() => alert('delete')}>
            <Trash />
            <Text slot="label">Delete…</Text>
            <Keyboard>⌘⌫</Keyboard>
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem>
              <Share />
              <Text slot="label">Share</Text>
            </MenuItem>
            <Menu>
              <MenuItem>
                <Mail />
                <Text slot="label">Email</Text>
              </MenuItem>
              <MenuItem>
                <Smartphone />
                <Text slot="label">SMS</Text>
              </MenuItem>
              <MenuItem>
                <Instagram />
                <Text slot="label">Instagram</Text>
              </MenuItem>
            </Menu>
          </SubmenuTrigger>
        </MenuSection>
        <Separator />
        <MenuSection selectionMode="multiple" defaultSelectedKeys={['files']}>
          <MenuItem id="files">Show files</MenuItem>
          <MenuItem id="folders">Show folders</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  )
};

export default ShareButton;




