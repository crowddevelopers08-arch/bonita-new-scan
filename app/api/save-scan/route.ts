import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const FORM_NAME = "website leads"

type TelecrmResponse = {
  modifiedLeadIds?: string[]
  status?: string
  errorString?: string
}

function getRequestOrigin(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") ?? "https"
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")

  return host ? `${protocol}://${host}` : ""
}

function normalizeUrl(pageUrl: unknown, req: NextRequest) {
  const submittedUrl = typeof pageUrl === "string" ? pageUrl.trim() : ""
  if (submittedUrl) return submittedUrl

  const referer = req.headers.get("referer")?.trim()
  if (referer) return referer

  return getRequestOrigin(req)
}

async function syncTelecrmLead({
  name,
  phone,
  location,
  problem,
  pageUrl,
}: {
  name: string
  phone: string
  location: string
  problem: string
  pageUrl: string
}) {
  const apiUrl = process.env.TELECRM_API_URL
  const apiKey = process.env.TELECRM_API_KEY

  if (!apiUrl || !apiKey) {
    return {
      ok: false,
      status: "missing_config",
      leadIds: "",
      error: "TeleCRM URL or API key is not configured.",
    }
  }

  const payload = {
    fields: {
      phone,
      name,
      location,
      problem,
      form_name: FORM_NAME,
      source: FORM_NAME,
      lead_source: FORM_NAME,
      website_url: pageUrl,
      page_url: pageUrl,
      live_url: pageUrl,
    },
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    })

    const body = (await response.json().catch(() => null)) as TelecrmResponse | null
    const status = body?.status ?? (response.ok ? "Submitted" : "Error")
    const error = body?.errorString ?? (response.ok ? "" : `TeleCRM returned HTTP ${response.status}`)
    const leadIds = Array.isArray(body?.modifiedLeadIds) ? body.modifiedLeadIds.join(", ") : ""

    return {
      ok: response.ok && status.toLowerCase() !== "error",
      status,
      leadIds,
      error,
    }
  } catch (error) {
    return {
      ok: false,
      status: "failed",
      leadIds: "",
      error: error instanceof Error ? error.message : "TeleCRM request failed.",
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, location, problem, imageData, pageUrl } = await req.json()

    if (!name || !phone || !problem || !imageData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedPhone = String(phone).trim()
    const normalizedName = String(name).trim()
    const normalizedLocation = typeof location === "string" ? location.trim() : ""
    const normalizedProblem = String(problem).trim()
    const normalizedPageUrl = normalizeUrl(pageUrl, req)

    const existing = await prisma.scan.findFirst({
      where: { phone: normalizedPhone },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: "This mobile number has already been used to submit a lead." },
        { status: 409 },
      )
    }

    const scan = await prisma.scan.create({
      data: {
        name: normalizedName,
        phone: normalizedPhone,
        location: normalizedLocation,
        problem: normalizedProblem,
        imageData,
        pageUrl: normalizedPageUrl,
        formName: FORM_NAME,
      },
    })

    const telecrm = await syncTelecrmLead({
      name: normalizedName,
      phone: normalizedPhone,
      location: normalizedLocation,
      problem: normalizedProblem,
      pageUrl: normalizedPageUrl,
    })

    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        telecrmStatus: telecrm.status,
        telecrmLeadIds: telecrm.leadIds,
        telecrmError: telecrm.error,
      },
    })

    if (!telecrm.ok) {
      console.error("TeleCRM sync failed:", telecrm.error)
    }

    return NextResponse.json({ success: true, id: scan.id, telecrm })
  } catch (error) {
    console.error("Failed to save scan:", error)
    const message =
      error instanceof Error && process.env.NODE_ENV !== "production"
        ? `Failed to save scan: ${error.message}`
        : "Failed to save scan"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
