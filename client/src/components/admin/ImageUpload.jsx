import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { api } from '../../api/client.js';

// WordPress-style image picker: file -> base64 -> POST /api/admin/upload -> URL
export default function ImageUpload({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (png, jpg, webp, gif, svg).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image too large (max 8 MB).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = async () => {
      setBusy(true);
      try {
        const res = await api.post('/admin/upload', { name: file.name, dataUrl: reader.result });
        onChange(res.url);
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <span className="label">{label}</span>}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-blue-300 bg-blue-50/50 transition hover:border-blue-500 hover:bg-blue-50 dark:border-blue-800 dark:bg-white/5 dark:hover:bg-white/10"
        >
          {value ? (
            <img src={value} alt="uploaded" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-300">
              {busy ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
              <span className="text-[10px] font-semibold">Upload</span>
            </span>
          )}
        </button>
        <div className="min-w-0">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {busy ? 'Uploading…' : value ? 'Image set — upload another to replace it.' : 'PNG, JPG, WEBP, GIF or SVG up to 8 MB.'}
          </p>
          {value && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="max-w-[16rem] truncate rounded-[8px] bg-blue-50 px-2 py-1 font-mono text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                {value}
              </span>
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="Remove image"
                className="rounded-[8px] p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
              >
                <X size={13} />
              </button>
            </div>
          )}
          {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
