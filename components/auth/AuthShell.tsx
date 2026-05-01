'use client';

import Logo from '@/components/Logo';

export const authTokens = {
  ink: '#1a1814',
  inkSoft: '#3d3a34',
  muted: '#5e5950',
  hairline: '#e6e1d6',
  cream: '#fbfaf6',
  helvetica: 'var(--font-helvetica)',
  granjon: 'var(--font-granjon)',
} as const;

interface AuthShellProps {
  children: React.ReactNode;
  topRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  card?: boolean;
  maxWidth?: number;
  footerRight?: string;
}

export const AuthShell = ({
  children,
  topRight,
  headerLeft,
  card = true,
  maxWidth = 460,
  footerRight,
}: AuthShellProps) => (
  <div className="h-[100dvh] overflow-hidden bg-[#f2f1ed] text-[#1a1814] flex flex-col">
    <header className="flex items-center justify-between gap-4 px-6 pt-6 pb-0 md:px-10 md:pt-8 w-full">
      {headerLeft}
      <div className="flex items-center gap-3 min-w-0">
        <Logo />
      </div>
      {topRight && <div className="flex items-center">{topRight}</div>}
    </header>

    <main className="flex flex-1 min-h-0 overflow-y-auto px-5 py-6 md:py-12 justify-center">
      <div className="w-full my-auto" style={{ maxWidth }}>
        {card ? (
          <div className="rounded-[6px] px-6 py-10 sm:px-10 sm:py-12 bg-[#fbfaf6] border border-[#e6e1d6] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_60px_-40px_rgba(26,24,20,0.18),0_8px_20px_-16px_rgba(26,24,20,0.10)]">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </main>

    <footer className="flex items-center justify-between px-6 py-6 md:px-10">
      <span className="font-helvetica font-normal text-[11px] text-[#5e5950]">© 2026 Haizel</span>
      <span className="font-helvetica font-normal text-[11px] uppercase tracking-[0.12em] text-[#5e5950]">
        {footerRight ?? 'By Invitation'}
      </span>
    </footer>
  </div>
);

interface AuthHeadingProps {
  title: string;
  italicWord: string;
  subtitle?: string;
}

export const AuthHeading = ({ title, italicWord, subtitle }: AuthHeadingProps) => {
  const parts = title.split(new RegExp(`(${italicWord})`, 'i'));
  return (
    <div className="mb-9 text-center">
      <h1 className="font-granjon font-normal normal-case text-[clamp(1.7rem,4.4vw,2.15rem)] leading-[1.15] tracking-[-0.005em] text-[#1a1814]">
        {parts.map((part, i) =>
          part.toLowerCase() === italicWord.toLowerCase() ? (
            <em key={i} className="italic">
              {part}
            </em>
          ) : (
            part
          )
        )}
      </h1>
      {subtitle && (
        <p className="mt-1.5 font-helvetica font-normal normal-case text-[13.5px] leading-[1.65] tracking-normal text-[#3d3a34]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const AuthHairline = () => <div className="mx-auto mb-8 h-px w-10 bg-[#e6e1d6]" />;

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const inputClass = (isFocused: boolean) =>
  `w-full px-4 py-[14px] bg-transparent border rounded-[4px] font-helvetica font-normal text-[12px] normal-case tracking-normal text-[#1a1814] focus:outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#3d3a34] placeholder:text-[12px] ${
    isFocused
      ? 'border-[#1a1814] shadow-[0_0_0_3px_rgba(26,24,20,0.04)]'
      : 'border-[#e6e1d6] shadow-none'
  }`;

export const AuthField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  hint,
  placeholder,
  multiline = false,
  isFocused,
  onFocus,
  onBlur,
}: AuthFieldProps) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className={`block font-helvetica font-normal normal-case text-[12px] tracking-normal transition-colors duration-200 ${
        isFocused ? 'text-[#1a1814]' : 'text-[#3d3a34]'
      }`}
    >
      {label}
    </label>
    {multiline ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={3}
        className={`${inputClass(isFocused)} resize-none`}
      />
    ) : (
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className={inputClass(isFocused)}
      />
    )}
    {hint && (
      <p className="px-1 font-helvetica font-normal normal-case text-[11.5px] tracking-normal text-[#5e5950]">
        {hint}
      </p>
    )}
  </div>
);

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton = ({ children, className, ...props }: PrimaryButtonProps) => (
  <button
    className={`group w-full py-[15px] rounded-[4px] transition-all bg-[#1a1814] text-[#fbfaf6] font-helvetica font-normal uppercase text-[13px] tracking-[0.01em] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    <span className="inline-flex items-center justify-center gap-2">
      {children}
      <span
        aria-hidden
        className="inline-block text-[14px] transition-transform duration-300 group-hover:translate-x-[2px]"
      >
        →
      </span>
    </span>
  </button>
);

interface QuietLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const QuietLink = ({ children, ...props }: QuietLinkProps) => (
  <button
    className="font-helvetica font-normal normal-case text-[12px] tracking-[0.01em] text-[#3d3a34] transition-opacity hover:opacity-60"
    {...props}
  >
    {children}
  </button>
);
