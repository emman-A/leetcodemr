'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Saves the scroll position for each route and restores it when navigating
 * back to that route. Prevents the "jumps to top on re-render" issue on mobile.
 */
export default function ScrollRestorer() {
  const pathname = usePathname()
  const positions = useRef<Record<string, number>>({})

  useEffect(() => {
    // Tell the browser not to manage scroll restoration — we'll do it
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    // Restore saved position for this route, or go to top
    const saved = positions.current[pathname] ?? 0
    window.scrollTo({ top: saved, behavior: 'instant' })

    // Save position when user scrolls or navigates away
    const savePosition = () => {
      positions.current[pathname] = window.scrollY
    }

    window.addEventListener('scroll', savePosition, { passive: true })
    return () => {
      savePosition()
      window.removeEventListener('scroll', savePosition)
    }
  }, [pathname])

  return null
}
