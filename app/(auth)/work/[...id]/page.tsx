import Work from "@/components/Work";
import QueryProvider from "../../../(public)/providers/QueryProvider";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string[] }>
}) {
  const { id } = await params
  const workId = Array.isArray(id) ? id[0] : id
  return (
    <QueryProvider>
      <Work id={workId} />
    </QueryProvider>
  )
}
