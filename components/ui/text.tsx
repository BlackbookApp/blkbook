import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

export const defaultVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  title: 'h4',
  heading: 'p',
  label: 'label',
  'label-micro': 'span',
  subtitle: 'p',
  nav: 'span',
  'body-1': 'p',
  'body-2': 'p',
  p: 'p',
  note: 'p',
  inherit: 'p',
};

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'font-granjon font-light text-[19px] uppercase tracking-[0.01em] leading-tight',
      h2: 'font-granjon font-normal text-[16px] uppercase tracking-[0.01em] leading-snug',
      h3: 'font-granjon font-light text-[15px] uppercase tracking-[0.01em]',
      title: 'font-granjon font-normal text-base uppercase tracking-tight',
      heading: 'font-helvetica text-[12px] font-bold uppercase tracking-[0.05em] text-bb-dark',
      label: 'font-helvetica text-[11px] font-normal uppercase tracking-[0.12em]',
      'label-micro': 'font-helvetica text-[10px] uppercase tracking-[0.2em] text-muted-foreground',
      subtitle: 'font-helvetica text-sm uppercase tracking-[0.12em] text-bb-muted',
      nav: 'font-helvetica text-[11px] font-normal uppercase tracking-[1.1px] text-bb-dark',
      'body-1': 'text-base leading-relaxed',
      'body-2': 'text-sm leading-relaxed text-muted-foreground',
      p: 'text-base leading-[1.4]',
      note: 'font-granjon italic text-[13px] text-bb-muted tracking-tight',
      inherit: '',
    },
    align: {
      inherit: '',
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    color: {
      default: '',
      muted: 'text-bb-muted',
      dark: 'text-bb-dark',
      cream: 'text-bb-cream',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    variant: 'p',
    align: 'inherit',
    color: 'default',
  },
});

type TextVariant = keyof typeof defaultVariantMapping;

type TextProps<C extends React.ElementType> = {
  as?: C;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?: 'default' | 'muted' | 'dark' | 'cream' | 'destructive';
  className?: string;
  paragraph?: boolean;
  variant?: TextVariant;
  variantMapping?: Partial<Record<TextVariant, string>>;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

const Text = <C extends React.ElementType>({
  as,
  align = 'inherit',
  color = 'default',
  className,
  paragraph = false,
  variant = 'p',
  variantMapping = defaultVariantMapping,
  children,
  ...restProps
}: TextProps<C>) => {
  const Component =
    as || (paragraph ? 'p' : variantMapping[variant] || defaultVariantMapping[variant]) || 'span';

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      className={cn(textVariants({ align, variant: variant as any, color }), className)}
      {...restProps}
    >
      {children}
    </Component>
  );
};

Text.displayName = 'Text';

export { Text };
