"use client"

import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import ResizeObserver from "resize-observer-polyfill"

interface SmoothScrollProps {
  children: ReactNode
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [pageHeight, setPageHeight] = useState(0)

  const resizePageHeight = useCallback((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      setPageHeight(entry.contentRect.height)
    }
  }, [])

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) =>
      resizePageHeight(entries)
    )
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [scrollRef, resizePageHeight])

  const { scrollY } = useScroll()
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight])
  const physics = { damping: 10, mass: 0.3, stiffness: 70 }
  const spring = useSpring(transform, physics)

  return (
    <>
      <motion.div
        ref={scrollRef}
        style={{ y: spring }}
        className="fixed  top-0"
      >
        {children}
      </motion.div>
      <div style={{ height: pageHeight }} />
    </>
  )
}

export default SmoothScroll
