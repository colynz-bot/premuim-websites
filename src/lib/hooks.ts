import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

export function useMedia(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Precise pointer that can hover: the only devices that get cursor effects. */
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)')

/** Id of the page section crossing the middle of the viewport. */
export function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return active
}
