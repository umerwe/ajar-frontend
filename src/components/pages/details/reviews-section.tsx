// components/pages/details/reviews-section.tsx
"use client";

import { useState } from "react";
import { Star, StarHalf, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import MyImage from "@/components/MyImage";

interface Review {
  _id: string;
  stars: number;
  comment: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 dark:text-gray-600"
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0 py-6 first:pt-0">
      <div className="flex gap-4">
        {/* Avatar with Next.js Image */}
        <div className="flex-shrink-0">
          {review.userId?.profilePicture ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <MyImage
                src={review.userId.profilePicture}
                alt={review.userId.name || "User avatar"}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aqua to-blue flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                {review.userId?.name || "Anonymous User"}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.stars} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {review.stars}.0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(review.createdAt), "MMM dd, yyyy")}</span>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2 first-letter:uppercase">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  let filteredReviews = [...reviews];
  if (filterRating) {
    filteredReviews = filteredReviews.filter(
      (r) => Math.floor(r.stars) === filterRating
    );
  }

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => Math.floor(r.stars) === rating).length;
    const percentage = (count / reviews.length) * 100;
    return { rating, count, percentage };
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Reviews
        </h2>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating rating={averageRating} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Filter by rating
        </label>
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, percentage, count }) => (
            <button
              key={rating}
              onClick={() =>
                setFilterRating(filterRating === rating ? null : rating)
              }
              className="w-full group transition-all duration-200 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rating}
                  </span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        filterRating === rating
                          ? "bg-gradient-to-r from-blue to-aqua"
                          : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredReviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
}