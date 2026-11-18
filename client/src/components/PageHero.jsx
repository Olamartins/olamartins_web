import { motion } from 'framer-motion';

export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid-blue pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="container-site relative pb-12 pt-16 text-center sm:pt-24">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-500 dark:text-neutral-400"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
