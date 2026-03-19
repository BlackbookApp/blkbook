'use client';

import { Input } from '@/components/ui/input';

interface Props {
  fullName: string;
  tagline: string;
  onChangeName: (v: string) => void;
  onChangeTagline: (v: string) => void;
}

export function StepEssentials({ fullName, tagline, onChangeName, onChangeTagline }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="blackbook-label block mb-2">Full Name</label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="As you want to be known"
          autoFocus
        />
      </div>
      <div>
        <label className="blackbook-label block mb-2">One line</label>
        <Input
          type="text"
          value={tagline}
          onChange={(e) => onChangeTagline(e.target.value)}
          placeholder="What you do or what you're building"
        />
      </div>
    </div>
  );
}
