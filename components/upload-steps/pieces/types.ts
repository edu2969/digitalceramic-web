import { useFormContext } from "react-hook-form"
import { PiezaConfig, UploadFormValues } from "../types"

export type PieceCardProps = {
  index: number
  piece: PiezaConfig | undefined
  register: ReturnType<typeof useFormContext<UploadFormValues>>["register"]
  control: ReturnType<typeof useFormContext<UploadFormValues>>["control"]
  setValue: ReturnType<typeof useFormContext<UploadFormValues>>["setValue"]
  warnings: string[]
  recommendations: string[]
}