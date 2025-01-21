"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
  shadowColor?: string // New prop to set the shadow color
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)", // Color for the fill (optional as we are focusing on the border flicker)
  // width,
  // height,
  className,
  maxOpacity = 0.3, // For border flickering opacity
  shadowColor = "rgba(0, 0, 0)", // Shadow color (default: semi-transparent black)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInView, setIsInView] = useState(false)

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string) => {
      if (typeof window === "undefined") {
        return `rgba(0, 0, 0,` // Fallback for SSR
      }
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (!ctx) return "rgba(255, 0, 0," // Error fallback
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      return `rgba(${r}, ${g}, ${b},`
    }
    return toRGBA(color)
  }, [color])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const canvasWidth = window.innerWidth
      const canvasHeight = window.innerHeight
      const dpr = window.devicePixelRatio || 1 // Handle high DPI displays

      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr
      canvas.style.width = `100%`
      canvas.style.height = `100%`

      const cols = Math.floor(canvasWidth / (squareSize + gridGap))
      const rows = Math.floor(canvasHeight / (squareSize + gridGap))

      // Create an array for each square's opacity value
      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity // Random opacity for flickering
      }

      return {
        width: canvasWidth,
        height: canvasHeight,
        cols,
        rows,
        squares,
        dpr,
      }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity // Flicker the border opacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "transparent" // No fill needed for flickering border
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j]

          const x = i * (squareSize + gridGap)
          const y = j * (squareSize + gridGap)

          // Draw squares with flickering border
          ctx.fillStyle = "transparent"
          ctx.strokeStyle = `${memoizedColor}${opacity})`
          ctx.lineWidth = 2
          ctx.shadowBlur = 5
          ctx.shadowColor = shadowColor

          // Draw the square with a border and shadow
          ctx.beginPath()
          ctx.rect(x * dpr, y * dpr, squareSize * dpr, squareSize * dpr)
          ctx.stroke()
          ctx.shadowBlur = 0 // Reset shadow blur for next square
        }
      }
    },
    [memoizedColor, squareSize, gridGap, shadowColor]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let { width, height, cols, rows, squares, dpr } = setupCanvas(canvas)

    let lastTime = 0
    const animate = (time: number) => {
      if (!isInView) return

      const deltaTime = (time - lastTime) / 1000
      lastTime = time

      updateSquares(squares, deltaTime)
      drawGrid(ctx, width * dpr, height * dpr, cols, rows, squares, dpr)
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      ;({ width, height, cols, rows, squares, dpr } = setupCanvas(canvas))
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting ?? false)
      },
      { threshold: 0 }
    )

    observer.observe(canvas)

    window.addEventListener("resize", handleResize)

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, isInView])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none size-full ${className}`}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  )
}

export default FlickeringGrid
