"use client";

import { motion } from "framer-motion";

// Wraps every route so navigations share one consistent enter transition.
// A template (not a layout) re-mounts on each navigation, so this animation
// replays every time the citizen moves between /, /record, /confirm, /track.
// Kept deliberately gentle so it layers under each screen's own richer
// entrance animations rather than fighting them.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
