import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { vcId } = await request.json()

    if (!vcId) {
      return NextResponse.json({ error: "VC ID is required" }, { status: 400 })
    }

    const apiToken = process.env.DHOLAKPUR_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({ error: "API token not configured" }, { status: 500 })
    }

    // Call the Dholakpur API to fetch credential details
    const response = await fetch(`https://api.dholakpur.fun/vc/fetch/related/docs/${vcId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch credential details: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching credential details:", error)
    return NextResponse.json({ error: "Failed to fetch credential details" }, { status: 500 })
  }
}
