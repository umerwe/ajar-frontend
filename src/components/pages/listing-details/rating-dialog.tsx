"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface RatingDialogProps {
  open: boolean
  onClose: () => void
}

export const RatingDialog = ({ open, onClose }: RatingDialogProps) => {
  const [rating, setRating] = useState(3)
  const [review, setReview] = useState("")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 gap-0">
        <VisuallyHidden>
          <DialogTitle>Rate Our App Experience</DialogTitle>
        </VisuallyHidden>

        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100">
            <X className="h-8 w-8" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">How would you rate our app experience?</h2>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-1 hover:scale-110 transition-transform">
                <Star
                  className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    }`}
                />
              </button>
            ))}
          </div>

          {/* Review Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Review</label>
            <Textarea
              placeholder="Type Here...."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px] mt-1 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
