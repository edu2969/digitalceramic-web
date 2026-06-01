"use client"

import { useEffect, useRef, useState } from "react"

type Option = {
  id: string
  label: string
  sublabel?: string
}

type Props = {
  value: string
  onChange: (text: string) => void
  onSelect: (option: Option | null) => void
  fetchOptions: (q: string) => Promise<Option[]>
  placeholder?: string
  className?: string
}

export default function Autocomplete({
  value,
  onChange,
  onSelect,
  fetchOptions,
  placeholder,
  className,
}: Props) {
  const [options, setOptions] = useState<Option[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    let cancel = false
    setLoading(true)
    const t = setTimeout(async () => {
      const res = await fetchOptions(value)
      if (!cancel) {
        setOptions(res)
        setLoading(false)
      }
    }, 200)
    return () => {
      cancel = true
      clearTimeout(t)
    }
  }, [value, open, fetchOptions])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          onSelect(null)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {open && (options.length > 0 || loading) && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading && (
            <li className="px-4 py-2 text-sm text-gray-400">Buscando…</li>
          )}

          {!loading &&
            options.map((o) => (
              <li
                key={o.id}
                onClick={() => {
                  onSelect(o)
                  onChange(o.label)
                  setOpen(false)
                }}
                className="cursor-pointer px-4 py-2 hover:bg-blue-50"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {o.label}
                </p>
                {o.sublabel && (
                  <p className="text-xs text-gray-500">{o.sublabel}</p>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
