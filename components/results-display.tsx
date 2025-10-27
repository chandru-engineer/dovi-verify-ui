"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { playSound } from "@/lib/audio-utils"

interface VerificationResult {
  message: string
  title: string
  content: string
  proof: {
    is_verified_issuer: boolean
    content_integrity: boolean
    sentiment: string
    notes: string
    related_vc_ids: string[]
    checked_at: string
    semantic_similarity: number
  }
}

interface ResultsDisplayProps {
  result: VerificationResult
  onReset: () => void
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  const [relatedDocs, setRelatedDocs] = useState<any[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [selectedVcId, setSelectedVcId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!hasPlayedSound) {
      const soundType = result.proof.is_verified_issuer ? "success" : "alert"
      playSound(soundType)
      setHasPlayedSound(true)
    }
  }, [result, hasPlayedSound])

  useEffect(() => {
    if (result.proof.related_vc_ids.length > 0) {
      setLoadingDocs(true)
      fetch("/api/fetch-related-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vcIds: result.proof.related_vc_ids }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRelatedDocs(data.documents || [])
        })
        .catch((err) => console.error("Failed to fetch related docs:", err))
        .finally(() => setLoadingDocs(false))
    }
  }, [result.proof.related_vc_ids])

  const isFullyAuthentic = result.proof.content_integrity && result.proof.semantic_similarity > 0.8
  const isIssuerNotVerified = !result.proof.is_verified_issuer

  const similarityPercent = Math.round(result.proof.semantic_similarity * 100)

  const openCredentialDetails = (vcId: string) => {
    setSelectedVcId(vcId)
    setIsModalOpen(true)
  }

  if (isFullyAuthentic) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-8 border-2 border-green-200 bg-green-50">
          <motion.div
            className="text-center"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: 1, ease: "easeInOut" }}
          >
            <motion.div
              className="text-6xl mb-4 text-green-600"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ✓
            </motion.div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Document Verified!</h2>
            <p className="text-lg text-green-700 mb-6">
              This document is authentic and matches official records with {similarityPercent}% confidence.
            </p>
            {result.title && (
              <p className="text-sm text-green-600 mb-4">
                <span className="font-semibold">Document:</span> {result.title}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-4 bg-white/70 rounded-lg mb-8 border border-green-200 mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Verified Issuer</p>
                <p className="text-sm font-semibold text-green-700">Yes</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Sentiment</p>
                <p className="text-sm font-semibold text-green-700 capitalize">{result.proof.sentiment}</p>
              </div>
            </div>
          </motion.div>

          {relatedDocs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="p-4 bg-white/70 rounded-lg mb-8 border border-green-200"
            >
              <p className="text-sm font-semibold text-foreground mb-3">Related Official Documents</p>
              <div className="space-y-3">
                {relatedDocs.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-3 bg-green-50 rounded border border-green-100"
                  >
                    {doc.document?.title && (
                      <p className="text-sm font-semibold text-foreground mb-1">{doc.document.title}</p>
                    )}
                    {doc.document?.issuer_did && (
                      <p className="text-xs text-muted-foreground font-mono break-all mb-1">
                        Issuer: {doc.document.issuer_did}
                      </p>
                    )}
                    {doc.did && <p className="text-xs text-muted-foreground font-mono break-all">VC ID: {doc.did}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={onReset} variant="outline" className="px-8 bg-transparent">
              Verify Another
            </Button>
            <Button className="px-8 bg-green-600 hover:bg-green-700 text-white">Download Report</Button>
          </motion.div>
        </Card>
      </motion.div>
    )
  }

  if (isIssuerNotVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-8 border-2 border-red-200 bg-red-50">
          <motion.div
            className="text-center"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: 1, ease: "easeInOut" }}
          >
            <motion.div
              className="text-6xl mb-4 text-red-600"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ⚠
            </motion.div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Verification Alert</h2>
            <p className="text-lg text-red-700 mb-6">
              This document could not be verified as it does not match any official records from a verified issuer.
            </p>
            {result.title && (
              <p className="text-sm text-red-600 mb-4">
                <span className="font-semibold">Document:</span> {result.title}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-4 bg-white/70 rounded-lg mb-8 border border-red-200 mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Verified Issuer</p>
                <p className="text-sm font-semibold text-red-700">No</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">Sentiment</p>
                <p className="text-sm font-semibold text-red-700 capitalize">{result.proof.sentiment}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="p-4 bg-white/70 rounded-lg mb-8 border border-red-200"
          >
            <p className="text-sm font-semibold text-foreground mb-2">Verification Notes</p>
            <p className="text-sm text-muted-foreground">{result.proof.notes}</p>
          </motion.div>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={onReset} variant="outline" className="px-8 bg-transparent">
              Verify Another
            </Button>
            <Button className="px-8 bg-red-600 hover:bg-red-700 text-white">Download Report</Button>
          </motion.div>
        </Card>
      </motion.div>
    )
  }

  const statusColor = result.proof.is_verified_issuer ? "text-green-600" : "text-red-600"
  const bgColor = result.proof.is_verified_issuer ? "bg-green-50" : "bg-red-50"
  const borderColor = result.proof.is_verified_issuer ? "border-green-200" : "border-red-200"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <Card className={`p-8 border-2 ${borderColor} ${bgColor}`}>
        <motion.div
          className="text-center mb-6"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, repeat: 1, ease: "easeInOut" }}
        >
          <motion.div
            className={`text-6xl mb-4 ${statusColor}`}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {result.proof.is_verified_issuer ? "✓" : "⚠"}
          </motion.div>
          <h2 className={`text-3xl font-bold ${statusColor}`}>
            {result.proof.is_verified_issuer ? "Document Verified!" : "Verification Alert"}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4 mb-8"
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              className="p-4 bg-white/50 rounded-lg"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-sm text-muted-foreground">Verified Issuer</p>
              <p className="font-semibold text-foreground">{result.proof.is_verified_issuer ? "Yes" : "No"}</p>
            </motion.div>
            <motion.div
              className="p-4 bg-white/50 rounded-lg"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-sm text-muted-foreground">Content Integrity</p>
              <p className="font-semibold text-foreground">{result.proof.content_integrity ? "Valid" : "Invalid"}</p>
            </motion.div>
            <motion.div
              className="p-4 bg-white/50 rounded-lg"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-sm text-muted-foreground">Sentiment</p>
              <p className="font-semibold text-foreground capitalize">{result.proof.sentiment}</p>
            </motion.div>
            <motion.div
              className="p-4 bg-white/50 rounded-lg"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-sm text-muted-foreground">Similarity Score</p>
              <p className="font-semibold text-foreground">{similarityPercent}%</p>
            </motion.div>
            {result.title && (
              <motion.div
                className="p-4 bg-white/50 rounded-lg md:col-span-2"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <p className="text-sm text-muted-foreground">Document Title</p>
                <p className="font-semibold text-foreground truncate">{result.title}</p>
              </motion.div>
            )}
            <motion.div
              className="p-4 bg-white/50 rounded-lg md:col-span-2"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-sm text-muted-foreground">Verified At</p>
              <p className="font-semibold text-foreground">{new Date(result.proof.checked_at).toLocaleString()}</p>
            </motion.div>
          </motion.div>

          <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold text-foreground">Semantic Similarity</p>
              <p className="text-sm font-semibold text-foreground">{similarityPercent}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full ${result.proof.is_verified_issuer ? "bg-green-500" : "bg-red-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${similarityPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="p-4 bg-white/70 rounded-lg mb-8 border border-primary/20"
        >
          <p className="text-sm font-semibold text-foreground mb-2">Verification Notes</p>
          <p className="text-sm text-muted-foreground">{result.proof.notes}</p>
        </motion.div>

        {result.proof.related_vc_ids.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="p-4 bg-white/70 rounded-lg mb-8 border border-primary/20"
          >
            <p className="text-sm font-semibold text-foreground mb-3">Related Credentials</p>
            <div className="space-y-2">
              {result.proof.related_vc_ids.map((id, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <p className="text-xs font-mono text-muted-foreground break-all flex-1">{id}</p>
                  <button
                    onClick={() => openCredentialDetails(id)}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    title="View credential details"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={onReset} variant="outline" className="px-8 bg-transparent">
            Verify Another
          </Button>
          <Button className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground">Download Report</Button>
        </motion.div>
      </Card>

      <motion.div
        className="mt-12 text-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <p className="text-muted-foreground">Powered by Dholakpur's finest verification technology</p>
      </motion.div>
    </motion.div>
  )
}
