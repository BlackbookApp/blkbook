import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

export const defaultVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  title: 'h4',
  subtitle: 'p',
  heading: 'p',
  nav: 'span',
  'body-1': 'p',
  'body-2': 'p',
  label: 'label',
  p: 'p',
  inherit: 'p',
};

const textVariants = cva('', {
  variants: {
    variant: {
      // Canela Deck headings — uppercase, tracked
      h1: 'font-canela-deck font-normal text-4xl uppercase tracking-[0.01em] leading-[1.2]',
      h2: 'font-canela-deck font-normal text-2xl uppercase tracking-[0.01em] leading-[1.3]',
      h3: 'font-canela-deck font-normal text-lg uppercase tracking-[0.01em] leading-[1.4]',
      // Section title — matches .blackbook-title
      title: 'font-canela-deck font-normal text-base uppercase tracking-[0.01em]',
      // Muted subtitle — matches .blackbook-subtitle
      subtitle: 'text-sm uppercase tracking-[0.12em] text-bb-muted',
      // Small bold label — matches .blackbook-heading
      heading: 'text-[12px] font-bold uppercase tracking-[0.05em] text-bb-dark',
      // Navigation text — matches .blackbook-nav
      nav: 'text-[13px] font-medium uppercase tracking-[0.01em] text-bb-dark',
      // Body sizes
      'body-1': 'text-base leading-relaxed',
      'body-2': 'text-sm leading-relaxed',
      // Small label — matches .blackbook-label
      label: 'text-[11px] font-light uppercase tracking-[0.05em] text-bb-dark',
      // Default paragraph
      p: 'text-base leading-[1.4]',
      inherit: '',
    },
    align: {
      inherit: '',
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    variant: 'p',
    align: 'inherit',
  },
});

type TextProps<C extends React.ElementType> = {
  as?: C;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  className?: string;
  paragraph?: boolean;
  variant?: keyof typeof defaultVariantMapping;
  variantMapping?: typeof defaultVariantMapping;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

const Text = <C extends React.ElementType>({
  as,
  align = 'inherit',
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
    <Component className={cn(textVariants({ align, variant }), className)} {...restProps}>
      {children}
    </Component>
  );
};

Text.displayName = 'Text';

export { Text };
