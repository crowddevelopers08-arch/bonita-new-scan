import { NextRequest, NextResponse } from "next/server"
import { prismaTambaram } from "@/lib/prisma"
import type { PrismaClient } from "@prisma/client"

export const runtime = "nodejs"

const FORM_NAME = "tambaram-scan-lp"
const DUPLICATE_PHONE_ERROR = "This mobile number has already been used to submit a lead."
const ALLOWED_LOCATIONS = ["Tambaram", "Urapakkam"]

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

function getPhoneDuplicateKey(phone: string) {
  const digits = phone.replace(/\D/g, "")

  if (digits.length > 10) {
    return digits.slice(-10)
  }

  return digits
}

async function findDuplicateScanByPhone(client: PrismaClient, phone: string) {
  const submittedPhoneKey = getPhoneDuplicateKey(phone)

  if (!submittedPhoneKey) {
    return null
  }

  const existingScans = await client.scan.findMany({
    select: {
      id: true,
      phone: true,
    },
  })

  return existingScans.find((scan) => getPhoneDuplicateKey(scan.phone) === submittedPhoneKey) ?? null
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

    if (!ALLOWED_LOCATIONS.includes(normalizedLocation)) {
      return NextResponse.json({ error: "Please select a valid location" }, { status: 400 })
    }

    // Check for duplicate phone in Tambaram database
    const existing = await findDuplicateScanByPhone(prismaTambaram, normalizedPhone)
    if (existing) {
      return NextResponse.json(
        { error: DUPLICATE_PHONE_ERROR },
        { status: 409 },
      )
    }

    // Save to Tambaram database only (no TeleCRM sync for this page)
    const scan = await prismaTambaram.scan.create({
      data: {
        name: normalizedName,
        phone: normalizedPhone,
        location: normalizedLocation,
        problem: normalizedProblem,
        imageData,
        pageUrl: normalizedPageUrl,
        formName: FORM_NAME,
        telecrmStatus: "disabled",
      },
    })

    return NextResponse.json({
      success: true,
      id: scan.id,
      savedToDatabase: true,
    })
  } catch (error) {
    console.error("Failed to save tambaram scan:", error)
    const message =
      error instanceof Error && process.env.NODE_ENV !== "production"
        ? `Failed to save scan: ${error.message}`
        : "Failed to save scan"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
