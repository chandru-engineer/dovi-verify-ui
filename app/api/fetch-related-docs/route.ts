import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vcIds } = body

    if (!vcIds || !Array.isArray(vcIds) || vcIds.length === 0) {
      return NextResponse.json({ error: "No VC IDs provided" }, { status: 400 })
    }

    const apiToken = process.env.DHOLAKPUR_API_TOKEN
    if (!apiToken) {
      console.error("Missing DHOLAKPUR_API_TOKEN environment variable")
      return NextResponse.json({ error: "Service not configured" }, { status: 500 })
    }

    // Fetch all related documents in parallel
    const docPromises = vcIds.map((vcId) =>
      fetch(`https://api.dholakpur.fun/vc/fetch/related/docs/${vcId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch(() => null),
    )

    const results = await Promise.all(docPromises)
    const documents = results.filter((doc) => doc !== null)

    return NextResponse.json({ documents }, { status: 200 })
  } catch (error) {
    console.error("Fetch related docs error:", error)
    return NextResponse.json({ error: "Failed to fetch related documents" }, { status: 500 })
  }
}
