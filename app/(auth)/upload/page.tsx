import UploadWizard from "@/components/UploadWizard";
import QueryProvider from "../../(public)/providers/QueryProvider";

type SearchParams = {
  id?: string;
};

export default function UploadPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const trabajoId = searchParams?.id || undefined;

  return (
    <main className="bg-white text-[#1C4880]">
      <QueryProvider>
        <UploadWizard trabajoId={trabajoId} />
      </QueryProvider>
    </main>
  );
}
