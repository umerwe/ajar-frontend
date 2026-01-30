export const getRatingText = (rating: number): string => {
  if (!rating || rating <= 0) return "Not Reviewed";

  if (rating >= 9) return "Excellent";
  if (rating >= 7) return "Very Good";
  if (rating >= 5) return "Good";
  if (rating >= 3) return "Fair";
  if (rating >= 1) return "Average";

  return "Not Reviewed";
};
