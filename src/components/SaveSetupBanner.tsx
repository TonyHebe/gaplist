type SaveSetupBannerProps = {
  supabaseUrl?: string;
};

const MIGRATION_SQL = `alter table public.posts add column if not exists saved boolean not null default false;
alter table public.posts add column if not exists saved_at timestamptz;
create index if not exists posts_saved_idx on public.posts (saved) where saved = true;`;

function sqlEditorUrl(supabaseUrl?: string) {
  const match = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match) {
    return `https://supabase.com/dashboard/project/${match[1]}/sql/new`;
  }
  return "https://supabase.com/dashboard";
}

export function SaveSetupBanner({ supabaseUrl }: SaveSetupBannerProps) {
  const editorUrl = sqlEditorUrl(supabaseUrl);

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
      <p className="font-semibold">Save needs a one-time database setup</p>
      <p className="mt-2 leading-relaxed">
        The <code className="rounded bg-amber-100 px-1">saved</code> column is missing from your
        Supabase <code className="rounded bg-amber-100 px-1">posts</code> table. Paste this SQL in
        the Supabase SQL Editor, then refresh:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 text-xs leading-relaxed text-zinc-800">
        {MIGRATION_SQL}
      </pre>
      <a
        href={editorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
      >
        Open Supabase SQL Editor →
      </a>
    </div>
  );
}
