import { useAutoSaveEngine } from "./useAutoSaveEngine"

export function useAutoSave(saveFn: (payload: any) => Promise<void>) {
  const engine = useAutoSaveEngine(saveFn)

  return {
    saveField: engine.setField,
    flush: engine.flush,
  }
}