import UploadWizard from "@/app/components/Upload"
import QueryProvider from "../providers/QueryProvider"

export default function UploadPage() {
  return (
    <main className="bg-white text-[#1C4880]">
      <QueryProvider>
        <UploadWizard />
      </QueryProvider>
    </main>
  )
}
