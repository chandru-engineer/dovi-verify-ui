"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import VerificationForm from "@/components/verification-form"
import ResultsDisplay from "@/components/results-display"

export default function Home() {
  const [verificationResult, setVerificationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerification = async (content: string, title?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, title }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Verification failed")
      }

      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred during verification"
      setError(message)
      console.error("Verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        {!verificationResult ? (
          <VerificationForm onVerify={handleVerification} isLoading={isLoading} error={error} />
        ) : (
          <ResultsDisplay result={verificationResult} onReset={() => setVerificationResult(null)} />
        )}
      </div>
    </main>
  )
}
