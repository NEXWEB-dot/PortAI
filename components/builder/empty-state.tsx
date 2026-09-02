"use client";

import { motion } from "framer-motion";
import {
  FileText,
  LayoutTemplate,
  MessageSquare,
  Sparkles,
  Wand2,
} from "lucide-react";

const suggestions = [
  { icon: FileText, label: "Drop a PDF resume" },
  { icon: MessageSquare, label: "Describe your experience" },
  { icon: Wand2, label: "Generate my portfolio" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function EmptyState() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center"
    >
      <motion.div variants={item} className="relative mb-6">
        <div className="absolute inset-0 animate-pulse-ring rounded-full bg-gold/20" />
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 shadow-lg shadow-gold/5"
        >
          <Sparkles className="h-7 w-7 text-gold" />
        </motion.div>
      </motion.div>

      <motion.h2
        variants={item}
        className="font-display mb-3 text-3xl font-semibold tracking-tight md:text-4xl"
      >
        Craft your{" "}
        <span className="gold-gradient-text">signature portfolio</span>
      </motion.h2>

      <motion.p
        variants={item}
        className="mb-10 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        Upload your resume or tell us your story. Our AI designs a bespoke
        landing page that showcases your work with refined, editorial polish.
      </motion.p>

      <motion.div
        variants={item}
        className="flex flex-wrap justify-center gap-3"
      >
        {suggestions.map(({ icon: Icon, label }) => (
          <motion.span
            key={label}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-full border border-gold/15 bg-card/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-gold/30 hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5 text-gold" />
            {label}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        variants={item}
        className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <LayoutTemplate className="h-3.5 w-3.5 text-gold" />
        <span>Luxury layouts · Tailored typography · Zero templates</span>
      </motion.div>
    </motion.div>
  );
}
