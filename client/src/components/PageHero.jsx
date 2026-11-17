import { motion } from 'framer-motion';

export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="container-site pb-12 pt-16 text-center sm:pt-24">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold uppercase tracking-widest text-accent dark:text-accent-dark"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400"
        >
          {subtitle}
        </motion.p>
      )}
    </section>
  );
}
