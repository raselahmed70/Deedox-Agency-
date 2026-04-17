"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Card {
  id: number
  contentType: 1 | 2 | 3
}

const cardData = {
  1: {
    title: "RAMIM YT",
    description: "Cinematic Experience Platform",
    image: "https://majestic-lamington-2cfa3b.netlify.app/og-image.png",
    url: "https://majestic-lamington-2cfa3b.netlify.app/"
  },
  2: {
    title: "Glowing Agency",
    description: "Modern Digital Branding",
    image: "https://glowing-pony-69758b.netlify.app/og.png",
    url: "https://glowing-pony-69758b.netlify.app/"
  },
  3: {
    title: "Deedox Platform",
    description: "Advanced Agency Solutions",
    image: "https://deedox.xo.je/og-image.png",
    url: "https://deedox.xo.je/?i=1"
  },
}

const initialCards: Card[] = [
  { id: 1, contentType: 1 },
  { id: 2, contentType: 2 },
  { id: 3, contentType: 3 },
]

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
]

const exitAnimation = {
  y: 340,
  scale: 1,
  zIndex: 10,
}

const enterAnimation = {
  y: -16,
  scale: 0.9,
}

function CardContent({ contentType }: { contentType: 1 | 2 | 3 }) {
  const data = cardData[contentType]

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
        <img
          src={data.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
          alt={data.title}
          className="h-full w-full select-none object-cover opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
          }}
        />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-white font-serif text-lg">{data.title}</span>
          <span className="text-white/40 text-xs font-sans truncate">{data.description}</span>
        </div>
        <a 
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95"
        >
          Explore
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

function AnimatedCard({
  card,
  index,
  isAnimating,
}: {
  card: Card
  index: number
  isAnimating: boolean
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2]
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index

  const exitAnim = index === 0 ? exitAnimation : undefined
  const initialAnim = index === 2 ? enterAnimation : undefined

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0,
      }}
      style={{
        zIndex,
        left: "50%",
        x: "-50%",
        bottom: 0,
      }}
      className="absolute flex h-[300px] w-[324px] items-center justify-center overflow-hidden rounded-2xl liquid-glass p-1 shadow-2xl sm:w-[512px]"
    >
      <CardContent contentType={card.contentType} />
    </motion.div>
  )
}

export default function AnimatedCardStack() {
  const [cards, setCards] = useState(initialCards)
  const [isAnimating, setIsAnimating] = useState(false)
  const [nextId, setNextId] = useState(4)

  const handleAnimate = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const nextContentType = ((cards[2].contentType % 3) + 1) as 1 | 2 | 3
    
    // Simulate animation timing
    setTimeout(() => {
        setCards((prev) => [...prev.slice(1), { id: nextId, contentType: nextContentType }])
        setNextId((prev) => prev + 1)
        setIsAnimating(false)
    }, 100)
  }

  return (
    <section className="flex w-full flex-col items-center justify-center pt-24 pb-24 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Selected Works</h2>
        <p className="text-white/40 max-w-lg mx-auto font-sans">
          A collection of digital experiences we've crafted for forward-thinking brands and creators.
        </p>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden sm:w-[644px]">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedCard key={card.id} card={card} index={index} isAnimating={isAnimating} />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mt-8 flex w-full items-center justify-center">
        <button
          onClick={handleAnimate}
          className="liquid-glass flex h-12 cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          Next Project
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
