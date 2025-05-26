import { ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: ReactNode;
}

export interface AvatarProps {
  className?: string;
  children?: ReactNode;
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export interface AvatarFallbackProps {
  className?: string;
  children?: ReactNode;
}

export interface SheetProps {
  children?: ReactNode;
}

export interface SheetTriggerProps {
  children?: ReactNode;
}

export interface SheetContentProps {
  children?: ReactNode;
  className?: string;
}

export interface DropdownMenuProps {
  children?: ReactNode;
}

export interface DropdownMenuTriggerProps {
  children?: ReactNode;
}

export interface DropdownMenuContentProps {
  children?: ReactNode;
  className?: string;
}

export interface DropdownMenuItemProps {
  children?: ReactNode;
  className?: string;
  onSelect?: () => void;
} 