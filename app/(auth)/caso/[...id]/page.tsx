import Work from "@/components/Caso";
import QueryProvider from "../../../(public)/providers/QueryProvider";

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string[] }>
  searchParams: Promise<{ view?: string }>
}) {
  const { id } = await params
  const { view } = await searchParams
  const workId = Array.isArray(id) ? id[0] : id
  return (
    <QueryProvider>
      <Work id={workId} dentistView={view === "dentist"} />
    </QueryProvider>
  )
}
