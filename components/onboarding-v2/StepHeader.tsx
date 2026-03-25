'use client';

import { motion } from 'framer-motion';

interface Props {
  label: string;
  title: string;
  subtext: string;
}

export function StepHeader({ label, title, subtext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <p className="blackbook-label mb-4">{label}</p>
      <div className="h-px bg-bb-rule mb-4" />
      <h1 className="font-granjon text-[26px] tracking-tight text-foreground mb-3 leading-tight">
        {title}
      </h1>
      <p className="font-helvetica text-[11px] font-light leading-relaxed text-bb-muted">
        {subtext}
      </p>
    </motion.div>
  );
}
