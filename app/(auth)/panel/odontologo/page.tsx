import DentistDashboard from "@/components/ListaCasosOdontologo"
import QueryProvider from "../../../(public)/providers/QueryProvider"

export default function DentistDashboardPage() {
  return (
    <QueryProvider>
      <DentistDashboard />
    </QueryProvider>
  )
}
