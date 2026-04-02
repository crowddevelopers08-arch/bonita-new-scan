import { prisma } from "@/lib/prisma"
import Image from "next/image"

const problemLabels: Record<string, string> = {
  "hair-fall": "Hair Fall",
  "crown-thinning": "Crown Thinning",
  "frontal-hair-loss": "Frontal Hair Loss",
  "dandruff-scalp-issues": "Dandruff / Scalp Issues",
  "low-hair-density": "Low Hair Density",
}

export default async function DashboardPage() {
  const scans = await prisma.scan.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">Scan Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            {scans.length} {scans.length === 1 ? "record" : "records"} stored
          </p>
        </div>

        {scans.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
            No scans yet. Complete a scan to see data here.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                {/* Captured image */}
                <div className="relative h-52 w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scan.imageData}
                    alt={`Scan of ${scan.name}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Problem badge */}
                  <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {problemLabels[scan.problem] ?? scan.problem}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{scan.name}</p>
                    <p className="text-xs text-muted-foreground">#{scan.id}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{scan.phone}</p>
                  <p className="text-xs text-muted-foreground pt-1">
                    {new Date(scan.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
