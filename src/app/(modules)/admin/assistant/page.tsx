export default function AssistantPage() {
  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)]">Assistente</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Em breve. Estamos construindo essa seção.</p>
      </header>

      <div className="max-w-xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)]">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">Status</div>
        <div className="mt-2 text-sm text-[var(--text-main)]">Placeholder ativo para desenvolvimento.</div>
      </div>
    </section>
  );
}
