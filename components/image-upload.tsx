"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Upload, X, ImageIcon, Video } from "lucide-react"
import Tesseract from "tesseract.js"
import { BACKEND_URL } from "@/components/config"

// Levenshtein Distance Helper
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  )

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + 1
            )
    }
  }

  return matrix[a.length][b.length]
}

function includesWithTolerance(text: string, word: string, tolerance = 1) {
  return text
    .split(/\s+/)
    .some((chunk) => levenshtein(chunk, word) <= tolerance)
}

export function ReviewProofUpload({
  reviewSubmitted,
  onProofSubmitted,
}: {
  reviewSubmitted: boolean
  onProofSubmitted: () => void
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [reviewStatus, setReviewStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setReviewStatus(null)
    }
  }

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    setReviewStatus(null)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsUploading(true)

    try {
      const { data } = await Tesseract.recognize(selectedFile, "eng", {
        logger: (m) => console.log(m),
      })

      const extractedText = data.text.toLowerCase()
      console.log("Extracted OCR Text:\n", extractedText)

      const keywords = [
        "barber",
        "haircut",
        "salon",
        "honeybliss",
        "downtown la barber",
        "cut",
        "trim",
        "fade",
        "style",
      ]

      const matched = keywords.some((word) =>
        includesWithTolerance(extractedText, word, 1)
      )

      if (matched) {
        const token = localStorage.getItem("token")

        const res = await fetch(`${BACKEND_URL}/api/v1/user/submit-review-proof`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const result = await res.json()

        if (res.ok) {
          setReviewStatus({
            success: true,
            message: "✅ Review verified! 200 points added.",
          })
          onProofSubmitted()
        } else {
          setReviewStatus({
            success: false,
            message: result.message || "❌ Error adding points.",
          })
        }
      } else {
        setReviewStatus({
          success: false,
          message: "❌ Review doesn't clearly mention the barber shop.",
        })
      }
    } catch (error) {
      console.error("OCR Error:", error)
      setReviewStatus({
        success: false,
        message: "❌ OCR failed. Please try a clearer screenshot.",
      })
    }

    setIsUploading(false)
  }

  const isImage = selectedFile?.type.startsWith("image/")
  const isVideo = selectedFile?.type.startsWith("video/")

  if (reviewSubmitted) {
    return (
      <Card className="bg-black border-2 border-green-500/30 text-center text-white p-6">
        <p>✅ You've already submitted your Google review proof.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 border-2 border-orange-500/50 shadow-lg shadow-orange-500/20">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-500/20 rounded-full border border-orange-500/30">
              <Star className="h-6 w-6 text-orange-500" />
            </div>
          </div>

          <h3 className="font-semibold text-white mb-2">Submit Google Review Proof for 5% Off</h3>
          <p className="text-gray-300 text-sm mb-4">
            Upload a screenshot or video of your Google review to claim your discount!
          </p>

          {!selectedFile ? (
            <div className="border-2 border-dashed border-orange-500/30 rounded-lg p-6 bg-black/20 hover:bg-black/30 transition-colors">
              <input
                type="file"
                id="review-proof"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label htmlFor="review-proof" className="cursor-pointer flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-white font-medium">Click to upload proof</div>
                <p className="text-gray-400 text-sm">PNG, JPG, MP4 up to 10MB</p>
              </label>
              <Button className="w-full bg-orange-500 mt-3 text-black hover:bg-orange-600">
                Google Maps
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black/40 rounded-lg p-4 border border-orange-500/20">
                <Button
                  onClick={handleRemoveFile}
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    {isImage ? (
                      <ImageIcon className="h-5 w-5 text-orange-500" />
                    ) : isVideo ? (
                      <Video className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Upload className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-sm truncate">{selectedFile.name}</p>
                    <p className="text-gray-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {isImage && previewUrl && (
                  <div className="mt-3">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full max-h-40 object-contain rounded-lg border border-orange-500/20"
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Submit Review Proof
                  </>
                )}
              </Button>

              {reviewStatus && (
                <div
                  className={`mt-2 text-sm font-medium ${
                    reviewStatus.success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {reviewStatus.message}
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-400 space-y-1 pt-4">
            <p>💡 <strong>Tips for best results:</strong></p>
            <p>• Include your name in the screenshot</p>
            <p>• Ensure the review text is visible</p>
            <p>• Mention 'barber', 'haircut', or shop name in review</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
