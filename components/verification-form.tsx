"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerificationFormProps {
  onVerify: (content: string, title?: string) => void
  isLoading: boolean
  error?: string | null
}

export default function VerificationForm({ onVerify, isLoading, error }: VerificationFormProps) {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")

  const handleSubmit = () => {
    if (content.trim()) {
      onVerify(content, title || undefined)
    }
  }

  const handleClear = () => {
    setContent("")
    setTitle("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <h2 className="text-3xl font-bold mb-2 text-center text-foreground">Verify Your Document</h2>
        <p className="text-center text-muted-foreground mb-8">
          Paste your document content to verify its authenticity using our advanced AI system
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6"
        >
          <label className="block text-sm font-semibold mb-3 text-foreground">Document Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title..."
            className="w-full p-3 border-2 border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background text-foreground placeholder-muted-foreground"
            disabled={isLoading}
          />
        </motion.div>

        {/* Text input area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-semibold mb-3 text-foreground">Document Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your document content here..."
            className="w-full h-48 p-4 border-2 border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none bg-background text-foreground placeholder-muted-foreground"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-2">Character count: {content.length} / 10,000</p>
        </motion.div>

        {/* Content preview */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20"
          >
            <p className="text-sm text-foreground">
              <span className="font-semibold">Content preview:</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{content}</p>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleClear}
            variant="outline"
            className="px-8 bg-transparent"
            disabled={isLoading || !content}
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Verifying...
              </>
            ) : (
              "Verify Document"
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
