import { useMemo, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { api } from '../api/client.js';
import { COUNTRIES, flagEmoji, validatePhone } from '../utils/countries.js';

const initial = { firstName: '', lastName: '', email: '', message: '' };
const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.iso === 'NG') || COUNTRIES[0];

export default function ConsultationForm() {
  const [form, setForm] = useState(initial);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [sending, setSending] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const phoneHint = useMemo(() => {
    if (!country.dial) return 'Full international number, starting with +';
    return `Digits only after +${country.dial} — e.g. ${country.iso === 'NG' ? '8012345678' : country.iso === 'US' || country.iso === 'CA' ? '2125551234' : country.iso === 'GB' ? '7911123456' : '…'} (${country.min || 6}–${country.max || 14} digits)`;
  }, [country]);

  const submit = async (e) => {
    e.preventDefault();
    const v = validatePhone(country, phone);
    if (!v.ok) {
      setPhoneError(v.error);
      return;
    }
    setPhoneError('');
    setSending(true);
    setStatus({ type: null, message: '' });
    try {
      const data = await api.post('/consultations', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        countryCode: country.dial ? `+${country.dial}` : '',
        phone: v.national,
        message: form.message,
      });
      setStatus({ type: 'success', message: data.message });
      setForm(initial);
      setPhone('');
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="firstName">First name *</label>
          <input id="firstName" className="input" required value={form.firstName} onChange={update('firstName')} placeholder="Ada" />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Last name</label>
          <input id="lastName" className="input" value={form.lastName} onChange={update('lastName')} placeholder="Lovelace" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" type="email" className="input" required value={form.email} onChange={update('email')} placeholder="you@company.com" />
        </div>
        <div>
          <label className="label" htmlFor="country">Country</label>
          <select
            id="country"
            className="input"
            value={country.iso}
            onChange={(e) => {
              setCountry(COUNTRIES.find((c) => c.iso === e.target.value) || DEFAULT_COUNTRY);
              setPhoneError('');
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.iso} value={c.iso}>
                {flagEmoji(c.iso)} {c.name} {c.dial ? `(+${c.dial})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="phone">Phone number (WhatsApp preferred) *</label>
          <div className="flex gap-2">
            <span className="input flex w-[5.5rem] shrink-0 items-center justify-center gap-1.5 !py-2.5 font-mono text-[13px] text-neutral-500 dark:text-neutral-400">
              <span className="text-base">{flagEmoji(country.iso)}</span>
              {country.dial ? `+${country.dial}` : '+'}
            </span>
            <input
              id="phone"
              className="input"
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError('');
              }}
              placeholder={country.dial ? phoneHint.split('—')[1]?.trim() || '…' : '+… full number'}
            />
          </div>
          {phoneError ? (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{phoneError}</p>
          ) : (
            <p className="mt-1.5 text-xs text-neutral-400">{phoneHint}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="label" htmlFor="message">How can I help? *</label>
        <textarea
          id="message"
          className="input min-h-28 resize-y"
          required
          value={form.message}
          onChange={update('message')}
          placeholder="Tell me about your data, your team and the decision you are trying to make…"
        />
      </div>

      {status.type && (
        <p
          className={`mt-4 flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm font-medium ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
          }`}
        >
          {status.type === 'success' && <CheckCircle2 size={16} />}
          {status.message}
        </p>
      )}

      <button type="submit" className="btn-primary mt-5 w-full sm:w-auto" disabled={sending}>
        <Send size={15} />
        {sending ? 'Sending…' : 'Get a Free Consultation'}
      </button>
    </form>
  );
}
