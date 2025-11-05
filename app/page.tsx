"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, AlertTriangle, Loader2, Info, CheckCircle2, XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VerificationProof {
  is_verified_issuer: boolean
  content_integrity: boolean
  sentiment: string
  notes: string
  related_vc_ids: string[]
  checked_at: string
  semantic_similarity: number
}

interface VerificationResponse {
  message: string
  title: string
  content: string
  proof: VerificationProof
}

export default function VerifierPortal() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResponse | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleVerify = async () => {
    if (!title.trim() || !content.trim()) {
      return
    }

    setIsVerifying(true)
    setResult(null)

    try {
      const response = await fetch("https://verify-test.credissuer.com/vc/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Verification failed")
      }

      const data: VerificationResponse = await response.json()
      setResult(data)
      setShowModal(true)
    } catch (error) {
      console.error("[v0] Verification error:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const similarityPercentage = result ? Math.round(result.proof.semantic_similarity * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <ShieldCheck className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Verifier Portal</h1>
            <p className="mt-2 text-slate-600">Verify content authenticity with AI</p>
          </div>

          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-slate-900">Content Verification</CardTitle>
              <CardDescription className="text-slate-600">
                Enter the title and content you wish to verify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter the title of the content"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isVerifying}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-slate-700">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Paste or type the content you want to verify"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[160px] border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isVerifying}
                />
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying || !title.trim() || !content.trim()}
                className="w-full bg-blue-600 py-6 text-lg font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Verify Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <AnimatePresence>
        {showModal && result && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="p-6">
                  <div className="mb-6 flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${
                        result.proof.is_verified_issuer ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {result.proof.is_verified_issuer ? (
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {result.proof.is_verified_issuer ? "Content Verified" : "Content Not Verified"}
                      </h2>
                      <p className="mt-1 text-slate-600">
                        {result.proof.is_verified_issuer
                          ? "This content is authentic and verified by official sources."
                          : "This content appears to be false or altered."}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Semantic Similarity</span>
                      <span className="text-3xl font-bold text-blue-600">{similarityPercentage}%</span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${similarityPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          result.proof.is_verified_issuer ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Info className="h-4 w-4 text-blue-500" />
                        Sentiment
                      </div>
                      <p className="mt-2 text-lg font-medium capitalize text-slate-900">{result.proof.sentiment}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Info className="h-4 w-4 text-blue-500" />
                        Content Integrity
                      </div>
                      <p className="mt-2 text-lg font-medium text-slate-900">
                        {result.proof.content_integrity ? "Intact" : "Compromised"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Analysis Notes
                    </div>
                    <p className="mt-2 leading-relaxed text-slate-700">{result.proof.notes}</p>
                  </div>

                  {result.proof.related_vc_ids.length > 0 && (
                    <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <ShieldCheck className="h-4 w-4 text-purple-500" />
                        Related Verifiable Credentials
                      </div>
                      <div className="mt-2 space-y-1">
                        {result.proof.related_vc_ids.map((id, index) => (
                          <p key={index} className="font-mono text-xs text-slate-600">
                            {id}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                    <span>Last verified at:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(result.proof.checked_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
