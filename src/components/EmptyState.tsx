type EmptyStateProps = {
  configured: boolean;
  error?: string | null;
};

export function EmptyState({ configured, error }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-zinc-900">
        {configured ? "No problem posts yet" : "Finish setup to start collecting posts"}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
        {configured
          ? "Run the fetch job to pull new public posts from startup subreddits. Matching posts with problem signals will appear here."
          : "Add your Supabase environment variables, run the SQL schema, then trigger the fetch cron endpoint."}
      </p>
      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}
      <div className="mt-6 space-y-2 text-left text-sm text-zinc-600">
        <p>1. Create a Supabase project and run `supabase/schema.sql`</p>
        <p>2. Copy `.env.example` to `.env.local` and fill in keys</p>
        <p>3. Run `npm run dev`, then trigger `GET /api/cron/fetch` with your `CRON_SECRET`</p>
      </div>
    </div>
  );
}
