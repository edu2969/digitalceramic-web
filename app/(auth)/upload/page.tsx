import UploadWizard from "@/components/Upload"
import QueryProvider from "../../(public)/providers/QueryProvider"

export default function UploadPage() {
  return (
    <main className="bg-white text-[#1C4880]">
      <QueryProvider>        
        <UploadWizard />
      </QueryProvider>
    </main>
  )
}
