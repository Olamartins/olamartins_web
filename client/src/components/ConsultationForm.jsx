import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { api } from '../api/client.js';

const initial = { firstName: '', lastName: '', email: '', code: '+234', zipCode: '', message: '' };

export default function ConsultationForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [sending, setSending] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: null, message: '' });
    try {
      const data = await api.post('/consultations', form);
      setStatus({ type: 'success', message: data.message });
      setForm(initial);
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
        <div className="grid grid-cols-[5rem_1fr] gap-2">
          <div>
            <label className="label" htmlFor="code">Code</label>
            <input id="code" className="input" value={form.code} onChange={update('code')} placeholder="+234" />
          </div>
          <div>
            <label className="label" htmlFor="zipCode">ZIP code</label>
            <input id="zipCode" className="input" value={form.zipCode} onChange={update('zipCode')} placeholder="500102" />
          </div>
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
          className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
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
