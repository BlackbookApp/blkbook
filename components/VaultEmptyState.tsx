'use client';

import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddDrawer from '@/components/AddDrawer';
import { Button } from './ui/button';

const VaultEmptyState = () => {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-6 pt-10 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[320px] w-full mx-auto text-center"
      >
        <p className="font-helvetica font-normal text-[10px] uppercase tracking-[0.28em] mb-8">
          Your vault
        </p>

        <div className="mx-auto mb-10 h-px w-8 bg-bb-rule" />

        <h2 className="font-granjon font-normal text-[clamp(1.85rem,5.4vw,2.35rem)] leading-[1.15] tracking-[-0.005em] text-bb-dark mb-5 normal-case">
          A blank page, <em className="italic">by design</em>
        </h2>

        <p className="font-helvetica font-normal text-[13.5px] leading-[1.7] max-w-[280px] mx-auto mb-10 ">
          The people you meet and the moments you save will live here.
        </p>

        <AddDrawer>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="group w-full py-[15px] bg-foreground text-background font-helvetica font-normal text-[13px]  tracking-[0.01em] rounded-[4px] transition-opacity hover:opacity-90"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Add your first contact
              <span
                aria-hidden
                className="inline-block text-[14px] transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Button>
        </AddDrawer>

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/scan-card')}
          className="mt-3 inline-flex items-center justify-center gap-2 mx-auto font-helvetica font-normal  transition-opacity hover:opacity-60"
        >
          <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="text-[12px] tracking-[0.01em] uppercase">Or scan a card</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default VaultEmptyState;
