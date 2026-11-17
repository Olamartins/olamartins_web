export default function EmptyState({ title = 'Nothing here yet', message = '' }) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
      <p className="text-lg font-semibold">{title}</p>
      {message && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{message}</p>}
    </div>
  );
}
