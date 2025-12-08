"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useSendReview } from "@/hooks/useReview"
import Loader from "@/components/common/loader"

interface RatingDialogProps {
  open: boolean
  onClose: () => void
  bookingId: string
}

export const RatingDialog = ({ open, onClose, bookingId }: RatingDialogProps) => {
  const { mutate, isPending } = useSendReview()
  const [rating, setRating] = useState(3)
  const [review, setReview] = useState("")

  const handleSubmit = () => {
    const formData = {
      bookingId,
      stars: rating,
      comment: review,
    }

    mutate(
      formData,
      {
        onSuccess: () => {
          setReview("")
          setRating(3)
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm px-0 py-3 gap-0">
        <VisuallyHidden>
          <DialogTitle>Rate Our App Experience</DialogTitle>
        </VisuallyHidden>

        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0"></div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              How would you rate our app experience?
            </h2>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
                type="button"
              >
                <Star
                  className={`h-8 w-8 ${star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
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
              className="min-h-[100px] mt-1 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full mt-6"
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? <Loader/> : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}