import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { GREETING, getReply } from '../utils/chatbot.js';
import { whatsappLink } from '../utils/countries.js';
import { api } from '../api/client.js';

function WhatsAppIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [waLink, setWaLink] = useState('https://wa.me/23412345678');
  const scrollRef = useRef(null);

  useEffect(() => {
    api
      .get('/site')
      .then((d) => {
        const link = whatsappLink(d.settings?.contact?.whatsapp);
        if (link) setWaLink(link);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        setMessages([{ from: 'bot', ...GREETING }]);
        setTyping(false);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value || typing) return;
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setInput('');
    setTyping(true);
    const reply = getReply(value);
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', ...reply }]);
      setTyping(false);
    }, 650 + Math.min(reply.reply.length * 8, 900));
  };

  const lastBot = [...messages].reverse().find((m) => m.from === 'bot');

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="card flex h-[30rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden !rounded-3xl shadow-glow"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3.5 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Bot size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold leading-tight">Ola's assistant</p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] text-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> online · rule-based, answers from this site only
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 transition hover:bg-white/15">
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                      m.from === 'user'
                        ? 'rounded-br-md bg-blue-600 text-white'
                        : 'rounded-bl-md border border-blue-100 bg-blue-50/70 text-neutral-700 dark:border-blue-900/60 dark:bg-white/5 dark:text-neutral-200'
                    }`}
                  >
                    {m.text ? (
                      <p className="whitespace-pre-line">{m.text}</p>
                    ) : (
                      <p className="whitespace-pre-line">{m.reply}</p>
                    )}
                    {m.links?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.links.map((l) =>
                          l.href ? (
                            <a
                              key={l.href + l.label}
                              href={l.href}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-[12px] bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              {l.label}
                            </a>
                          ) : (
                            <Link
                              key={l.to + l.label}
                              to={l.to}
                              onClick={() => setOpen(false)}
                              className="rounded-[12px] bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              {l.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-900/60 dark:bg-white/5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-blue-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {lastBot?.quick?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                {lastBot.quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-[12px] border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-800/60 dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-blue-100 p-3 dark:border-blue-900/50"
            >
              <input
                className="input !rounded-full !py-2.5"
                placeholder="Ask about services, shop, resources…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" aria-label="Send" className="btn-primary !h-10 !w-10 shrink-0 !rounded-[12px] !p-0" disabled={!input.trim()}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Ola on WhatsApp"
        title="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 transition hover:scale-105 hover:bg-[#1fb857] active:scale-95"
      >
        <WhatsAppIcon />
      </a>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-glow"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'bot'}
            initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X size={22} /> : <Bot size={22} />}
          </motion.span>
        </AnimatePresence>
        {!open && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-navy-975" />}
      </motion.button>
    </div>
  );
}
