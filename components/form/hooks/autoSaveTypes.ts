export type AutoSaveChange = {
  field: string
  value: any
  timestamp: number
}

export type AutoSavePayload = {
  id?: string
  changes: Record<string, any>
}