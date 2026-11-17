import { motion } from 'framer-motion';

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-neutral-500 dark:text-neutral-400">
      <motion.span
        className="block h-8 w-8 rounded-full border-2 border-neutral-300 border-t-accent dark:border-neutral-700 dark:border-t-accent-dark"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
