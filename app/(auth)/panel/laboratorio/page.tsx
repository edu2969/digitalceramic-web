import Dashboard from "@/components/DashboardLaboratorio";
import QueryProvider from "../../../(public)/providers/QueryProvider";

export default function DashboardPage() {
    return (
        <QueryProvider>
            <Dashboard />
        </QueryProvider>
    );
}
