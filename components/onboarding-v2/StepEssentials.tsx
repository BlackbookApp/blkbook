'use client';

import { Input } from '@/components/ui/input';

interface Props {
  fullName: string;
  roleTitle: string;
  onChangeName: (v: string) => void;
  onChangeRoleTitle: (v: string) => void;
}

export function StepEssentials({ fullName, roleTitle, onChangeName, onChangeRoleTitle }: Props) {
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
        <label className="blackbook-label block mb-2">Role</label>
        <Input
          type="text"
          value={roleTitle}
          onChange={(e) => onChangeRoleTitle(e.target.value)}
          placeholder="What you do or what you're building"
        />
      </div>
    </div>
  );
}
