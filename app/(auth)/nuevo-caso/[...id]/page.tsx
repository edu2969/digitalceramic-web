import UploadWizard from "@/components/UploadWizard"
import QueryProvider from "../../../(public)/providers/QueryProvider"

export default async function UploadCasePage({
  params,
}: {
  params: Promise<{ id: string[] }>
}) {
  const { id } = await params
  const trabajoId = Array.isArray(id) ? id[0] : id
  return (
    <main className="bg-white text-[#1C4880]">
      <QueryProvider>
        <UploadWizard trabajoId={trabajoId} />
      </QueryProvider>
    </main>
  )
}
