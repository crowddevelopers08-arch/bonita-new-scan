import { ScanDashboard } from "@/components/scan-dashboard"
import { prismaTambaram } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

type DashboardSearchParams = Promise<{
  q?: string
  problem?: string
  location?: string
  dateFrom?: string
  dateTo?: string
  page?: string
}>

export default async function DashboardTambaramPage({
  searchParams,
}: {
  searchParams?: DashboardSearchParams
}) {
  return (
    <ScanDashboard
      searchParams={searchParams}
      prismaClient={prismaTambaram}
      basePath="/dashboard-tambaram"
      title="Tambaram Scan Dashboard"
    />
  )
}
