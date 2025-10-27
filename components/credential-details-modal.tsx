"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface CredentialDetailsModalProps {
  vcId: string
  isOpen: boolean
  onClose: () => void
}

interface CredentialData {
  message: string
  did: string
  document: {
    title: string
    content: string
    issuer_did: string
    vc_proof: {
      credential_id: string
      content_hash: string
    }
    vc_type: string
    vc_status: string
    issuance_date: string
    expiration_date: string
    proof: {
      is_verified_issuer: boolean
      content_integrity: boolean
      sentiment: string
      notes: string
      related_vc_ids: string[]
    }
    did_document_url: string
  }
}

export default function CredentialDetailsModal({ vcId, isOpen, onClose }: CredentialDetailsModalProps) {
  const [credential, setCredential] = useState<CredentialData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && vcId) {
      setLoading(true)
      setError(null)
      fetch("/api/fetch-credential-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vcId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setCredential(data)
          }
        })
        .catch((err) => {
          console.error("Failed to fetch credential details:", err)
          setError("Failed to fetch credential details")
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, vcId])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Credential Details</h2>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading credential details...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {credential && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50 w-1/3">
                              Document Title
                            </td>
                            <td className="px-4 py-3 text-foreground">{credential.document.title}</td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Content</td>
                            <td className="px-4 py-3 text-foreground line-clamp-2">{credential.document.content}</td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Issuer DID</td>
                            <td className="px-4 py-3 text-foreground font-mono text-xs break-all">
                              {credential.document.issuer_did}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Credential ID</td>
                            <td className="px-4 py-3 text-foreground font-mono text-xs break-all">
                              {credential.document.vc_proof.credential_id}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Content Hash</td>
                            <td className="px-4 py-3 text-foreground font-mono text-xs break-all">
                              {credential.document.vc_proof.content_hash}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">
                              Credential Type
                            </td>
                            <td className="px-4 py-3 text-foreground">{credential.document.vc_type}</td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Status</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  credential.document.vc_status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {credential.document.vc_status.charAt(0).toUpperCase() +
                                  credential.document.vc_status.slice(1)}
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Issuance Date</td>
                            <td className="px-4 py-3 text-foreground">
                              {new Date(credential.document.issuance_date).toLocaleString()}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">
                              Expiration Date
                            </td>
                            <td className="px-4 py-3 text-foreground">
                              {new Date(credential.document.expiration_date).toLocaleString()}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">
                              Verified Issuer
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  credential.document.proof.is_verified_issuer
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {credential.document.proof.is_verified_issuer ? "Yes" : "No"}
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">
                              Content Integrity
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  credential.document.proof.content_integrity
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {credential.document.proof.content_integrity ? "Valid" : "Invalid"}
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Sentiment</td>
                            <td className="px-4 py-3 text-foreground capitalize">
                              {credential.document.proof.sentiment}
                            </td>
                          </tr>
                          {credential.document.proof.notes && (
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">Notes</td>
                              <td className="px-4 py-3 text-foreground text-sm">{credential.document.proof.notes}</td>
                            </tr>
                          )}
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-muted-foreground bg-gray-50">
                              DID Document URL
                            </td>
                            <td className="px-4 py-3">
                              <a
                                href={credential.document.did_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs break-all underline"
                              >
                                {credential.document.did_document_url}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex gap-3 pt-4"
                    >
                      <Button
                        onClick={onClose}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Close
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
