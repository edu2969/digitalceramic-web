import { useCallback, useRef } from "react"
import { AutoSaveChange } from "./autoSaveTypes"

type SaveFn = (payload: any) => Promise<void>

type Options = {
  debounceMs?: number
  batchMs?: number
}

export function useAutoSaveEngine(
  saveFn: SaveFn,
  options: Options = {}
) {
  const { debounceMs = 500, batchMs = 1200 } = options

  const queue = useRef<Map<string, AutoSaveChange>>(new Map())
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const batchTimer = useRef<NodeJS.Timeout | null>(null)
  const isFlushing = useRef(false)

  const scheduleFlush = useCallback(() => {
    if (batchTimer.current) return

    batchTimer.current = setTimeout(() => {
      flush()
    }, batchMs)
  }, [batchMs])

  const pushChange = useCallback(
    (field: string, value: any) => {
      const change: AutoSaveChange = {
        field,
        value,
        timestamp: Date.now(),
      }

      queue.current.set(field, change)

      scheduleFlush()
    },
    [scheduleFlush]
  )

  const setField = useCallback(
    (field: string, value: any) => {
      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field])
      }

      debounceTimers.current[field] = setTimeout(() => {
        pushChange(field, value)
      }, debounceMs)
    },
    [debounceMs, pushChange]
  )

  const flush = useCallback(async () => {
    if (isFlushing.current) return
    if (queue.current.size === 0) return

    isFlushing.current = true

    const payload = {
      changes: Object.fromEntries(
        Array.from(queue.current.entries()).map(([k, v]) => [
          k,
          v.value,
        ])
      ),
    }

    queue.current.clear()
    batchTimer.current = null

    try {
      await saveFn(payload)
    } catch (err) {
      // rollback simple: reinsert
      Object.entries(payload.changes).forEach(([field, value]) => {
        queue.current.set(field, {
          field,
          value,
          timestamp: Date.now(),
        })
      })
    } finally {
      isFlushing.current = false
    }
  }, [saveFn])

  return {
    setField,
    flush,
  }
}