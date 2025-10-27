import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, title } = body

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    // Validate content length (max 10,000 characters)
    const maxLength = 10000
    if (content.length > maxLength) {
      return NextResponse.json({ error: `Content exceeds ${maxLength} character limit` }, { status: 400 })
    }

    // Validate minimum content length
    if (content.trim().length < 10) {
      return NextResponse.json({ error: "Content must be at least 10 characters long" }, { status: 400 })
    }

    const apiToken = process.env.DHOLAKPUR_API_TOKEN
    if (!apiToken) {
      console.error("Missing DHOLAKPUR_API_TOKEN environment variable")
      return NextResponse.json({ error: "Verification service not configured" }, { status: 500 })
    }

    const verificationPayload: Record<string, string> = {
      content,
    }

    // Add title if provided
    if (title) {
      verificationPayload.title = title
    }

    const response = await fetch("https://api.dholakpur.fun/vc/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationPayload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Dholakpur API error:", errorData)
      return NextResponse.json(
        { error: "Verification service returned an error. Please try again." },
        { status: response.status },
      )
    }

    const result = await response.json()
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 })
  }
}
