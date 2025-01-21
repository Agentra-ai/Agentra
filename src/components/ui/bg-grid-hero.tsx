"use client"

import React, { useEffect } from "react"

const GridBackground: React.FC = () => {
  useEffect(() => {
    const circles = document.querySelectorAll(".circle")
    const animateCircles = () => {
      circles.forEach((circle) => {
        circle.classList.toggle("glow", Math.random() > 0.5)
      })
    }
    const interval = setInterval(animateCircles, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absulte grid grid-cols-5 gap-2 p-4">
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="relative h-24 w-24 border border-gray-300"
            >
              <div className="circle absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white transition-shadow"></div>
              <div className="dot-pattern absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform bg-gray-200"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default GridBackground
