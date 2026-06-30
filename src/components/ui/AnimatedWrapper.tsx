"use client"

import * as React from "react"
import { motion, type Variants, type HTMLMotionProps } from "framer-motion"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Scroll-reveal wrapper — replaces the repeated `initial={{opacity:0,y:30}}
 * animate={{opacity:1,y:0}}` boilerplate scattered through every
 * popcard-platform section component with a single shared primitive.
 */
export function AnimatedWrapper({
  children,
  delay = 0,
  className,
  once = true,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; once?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Staggered children container — pair with <AnimatedWrapper> children that omit their own delay. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: stagger }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Gentle infinite float — used for floating badge cards / decorative chips. */
export function FloatingElement({
  children,
  className,
  duration = 5,
  distance = 8,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
  distance?: number
  delay?: number
}) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{ repeat: Infinity, duration, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
