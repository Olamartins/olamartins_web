import { Plus, Trash2 } from 'lucide-react';

// Generic GUI editor for a list of objects (WordPress-style rows):
// fields: [{ key, label, type: 'text' | 'textarea' | 'select' | 'lines', options? }]
// 'lines' edits a string[] (one per line), used for bullet points.
export function ArrayEditor({ label, hint, value = [], onChange, fields, addLabel = 'Add item' }) {
  const emptyRow = () => Object.fromEntries(fields.map((f) => [f.key, f.type === 'lines' ? [] : f.type === 'select' ? f.options?.[0] || '' : '']));

  const update = (i, key, val) => onChange(value.map((row, j) => (j === i ? { ...row, [key]: val } : row)));
  const remove = (i) => onChange(value.filter((_, j) => j !== i));
  const add = () => onChange([...value, emptyRow()]);

  const renderField = (row, i, f) => {
    const common = 'input';
    if (f.type === 'select') {
      return (
        <select className={common} value={row[f.key] ?? ''} onChange={(e) => update(i, f.key, e.target.value)}>
          {f.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    }
    if (f.type === 'textarea') {
      return (
        <textarea className={`${common} min-h-20 resize-y`} value={row[f.key] ?? ''} onChange={(e) => update(i, f.key, e.target.value)} />
      );
    }
    if (f.type === 'lines') {
      return (
        <textarea
          className={`${common} min-h-24 resize-y font-mono text-xs`}
          placeholder={'One per line'}
          value={(row[f.key] || []).join('\n')}
          onChange={(e) => update(i, f.key, e.target.value.split('\n'))}
        />
      );
    }
    return <input className={common} value={row[f.key] ?? ''} onChange={(e) => update(i, f.key, e.target.value)} />;
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label">{label}</span>
        {hint && <span className="font-mono text-[10px] text-neutral-400">{hint}</span>}
      </div>
      <div className="mt-2 space-y-3">
        {value.map((row, i) => (
          <div key={i} className="card !rounded-[14px] relative space-y-3 p-4 pr-11">
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove row ${i + 1}`}
              className="absolute right-3 top-3 rounded-[8px] p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <Trash2 size={15} />
            </button>
            {fields.map((f) => (
              <div key={f.key}>
                <span className="label !mb-1">{f.label}</span>
                {renderField(row, i, f)}
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="btn-secondary !rounded-[12px] !px-4 !py-2 text-[13px]"
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>
    </div>
  );
}

// Simple editor for a list of plain strings (certifications, tools, tags)
export function StringListEditor({ label, value = [], onChange, addLabel = 'Add' }) {
  const update = (i, val) => onChange(value.map((v, j) => (j === i ? val : v)));
  const remove = (i) => onChange(value.filter((_, j) => j !== i));
  return (
    <div>
      <span className="label">{label}</span>
      <div className="mt-2 space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className="input" value={v} onChange={(e) => update(i, e.target.value)} />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${i + 1}`}
              className="rounded-[8px] p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, ''])} className="btn-secondary !rounded-[12px] !px-3.5 !py-1.5 text-xs">
          <Plus size={13} /> {addLabel}
        </button>
      </div>
    </div>
  );
}
