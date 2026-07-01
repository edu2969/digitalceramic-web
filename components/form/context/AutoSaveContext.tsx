import {
  AutoSaveContext,
  useAutoSaveContext as useProviderAutoSaveContext,
} from "@/components/form/provider/AutoSaveProvider";

export { AutoSaveContext };

export function useAutoSaveContext() {
  return useProviderAutoSaveContext();
}