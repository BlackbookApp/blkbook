'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { routes } from '@/lib/routes';
import { getAllUsersAction, deleteUserAction, type AdminUser } from '@/app/actions/admin-users';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    const data = await getAllUsersAction();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    getAllUsersAction().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.full_name?.toLowerCase().includes(q) ?? false) || u.email.toLowerCase().includes(q);
  });

  const handleDelete = () => {
    if (!pendingDelete) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteUserAction(pendingDelete.user_id);
      if (result.error) {
        setDeleteError(result.error);
      } else {
        setPendingDelete(null);
        await load();
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-2xl tracking-tight uppercase">Users</h1>
          <Link
            href={routes.adminUserCreate}
            className="text-[10px] uppercase tracking-widest px-4 py-2 bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            Create user
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full border border-border bg-background px-4 py-2.5 text-[11px] font-helvetica placeholder:text-bb-muted/50 focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        {deleteError && <p className="text-[11px] text-red-500 mb-4">{deleteError}</p>}

        {loading ? (
          <p className="text-[11px] text-bb-muted uppercase tracking-widest">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-[11px] text-bb-muted">
            {search ? 'No users match your search.' : 'No users found.'}
          </p>
        ) : (
          <div className="space-y-px">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="border border-border p-4 flex items-center gap-4 bg-background hover:bg-muted/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[11px] text-bb-muted uppercase">
                      {(user.full_name ?? user.email)[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.full_name ?? <span className="text-bb-muted italic">No name</span>}
                  </p>
                  <p className="text-[11px] text-bb-muted truncate">{user.email}</p>
                </div>

                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-border text-bb-muted">
                    {user.membership_type ?? 'guest'}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                      user.is_published
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {user.is_published ? 'published' : 'draft'}
                  </span>
                </div>

                <p className="hidden md:block text-[10px] text-bb-muted/60 shrink-0 w-24 text-right">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={routes.adminUserEdit(user.id)}>Edit</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:text-red-600 hover:border-red-300"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(user);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <strong>{pendingDelete?.full_name ?? pendingDelete?.email}</strong> and all their data
              including profile, components, vault contacts, and exchanges. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
