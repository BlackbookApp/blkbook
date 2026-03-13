import { Plus } from 'lucide-react';
import AddDrawer from '@/components/AddDrawer';

const VaultEmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="max-w-[260px] w-full text-center animate-fade-in space-y-8">
        {/* Copy */}
        <div className="space-y-4">
          <p className="font-display font-light text-[19px] tracking-[0.01em] uppercase text-bb-dark">
            Your Vault is Ready
          </p>
          <p className="font-helvetica font-light text-[13px] leading-[1.6] text-bb-dark">
            The people you meet and the moments you save will live here. This is yours alone. We
            never see it, touch it, or share it. Your privacy and information is paramount to us.
          </p>
        </div>

        {/* Prompt to use Add button */}
        <AddDrawer>
          <button className="flex items-center justify-center gap-2 mx-auto text-bb-muted">
            <span className="text-[10px] tracking-[0.2em] uppercase">Tap</span>
            <span className="w-6 h-6 border border-foreground/20 flex items-center justify-center">
              <Plus className="w-3 h-3 text-foreground/60" strokeWidth={2} />
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase">to begin</span>
          </button>
        </AddDrawer>
      </div>
    </div>
  );
};

export default VaultEmptyState;
