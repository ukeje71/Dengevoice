"use client";

import { motion } from "framer-motion";

// Shared loading animation — an orbiting-dots ring around a pulsing mic
// badge, used anywhere we're waiting on an API call (structuring a
// complaint, looking up a tracking ID). Replaces plain "Loading..." text.
export default function Loader({ message }: { message: string }) {
  const dots = [
    { angle: 0, color: "bg-marigold" },
    { angle: 120, color: "bg-brick" },
    { angle: 240, color: "bg-palm" },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          {dots.map((dot) => (
            <span
              key={dot.angle}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `rotate(${dot.angle}deg) translate(34px) rotate(-${dot.angle}deg)`,
              }}
              className={`h-3 w-3 rounded-full ${dot.color}`}
            />
          ))}
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7EFDD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresenceMessage message={message} />
    </div>
  );
}

// Small helper so the message crossfades cleanly if it ever changes
// mid-load, without pulling AnimatePresence into the main component.
function AnimatePresenceMessage({ message }: { message: string }) {
  return (
    <motion.p
      key={message}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="text-sm font-medium text-indigo"
    >
      {message}
    </motion.p>
  );
}