"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { playSound } from "@/lib/audio-utils"

export default function Hero() {
  const [hasPlayedSound, setHasPlayedSound] = useState(false)

  useEffect(() => {
    if (!hasPlayedSound) {
      playSound("processing")
      setHasPlayedSound(true)
    }
  }, [hasPlayedSound])

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent py-20 text-white">
      {/* Decorative elements with enhanced animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Welcome to Dholakpur</h1>
          <p className="text-xl md:text-2xl mb-2 text-white/90">Document Verification Portal</p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Verify the authenticity of your documents with our advanced AI-powered verification system. Trusted by
            Dholakpur's finest!
          </p>
        </motion.div>

        {/* Animated badge with enhanced pulse */}
        <motion.div
          className="mt-8 inline-block"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30"
            animate={{ borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.3)"] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="text-sm font-semibold">Powered by DOVI AI</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
