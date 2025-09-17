export interface BookingData {
  id: string
  status: string
  images: string[]
  title: string
  location: string
  freeCancellation: boolean
  noPrepayment: boolean
  category: string
  area: string
  beds: number
  baths: number
  guests: number
  price: number
  rating: number
  reviewCount: number
  isGuestFavorite: boolean
  host: {
    name: string
    rating: number
    totalReviews: number
  }
  highlights: {
    cleanliness: number
    location: number
    amenities: number
    service: number
  }
  features: string[]
  nearby: Array<{ place: string; walkTime: string }>
  guestImpressions: string[]
  reviews: Array<{
    id: number
    user: string
    date: string
    review: string
    image: string
  }>
  mostMentioned: Array<{ label: string; count: number }>
  roomType?: string
  roomSize?: string
  bedType?: string
  inclusions?: string[]
  checkIn?: {
    date: string
    time: string
  }
  checkOut?: {
    date: string
    time: string
  }
  nights?: number
  rooms?: number
}

export const bookingData: BookingData = {
  id: "A7X9L2",
  status: "Pending",
  images: [
    "/room-img1.webp",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ],
  title: "Pearl Continental Hotel, Lahore",
  location: "Mall Road, Lahore, Punjab 54000, Pakistan",
  freeCancellation: true,
  noPrepayment: true,
  category: "properties",
  area: "2500sqft",
  beds: 4,
  baths: 3,
  guests: 2,
  price: 130,
  rating: 4.8,
  reviewCount: 80,
  isGuestFavorite: true,
  host: {
    name: "Ayesha Malik",
    rating: 4.9,
    totalReviews: 1800,
  },
  highlights: {
    cleanliness: 8.4,
    location: 8.9,
    amenities: 8.0,
    service: 8.5,
  },
  features: ["Free WiFi", "Air conditioning", "Parking available", "Breakfast included", "Housekeeping", "Spa", "Gym"],
  nearby: [
    { place: "Lahore Fort", walkTime: "6 min walk" },
    { place: "Badshahi Mosque", walkTime: "10 min walk" },
    { place: "Shalimar Gardens", walkTime: "12 min drive" },
    { place: "Anarkali Bazaar", walkTime: "8 min walk" },
  ],
  guestImpressions: ["Luxurious rooms", "Prime location", "Exceptional service", "Very clean", "Great breakfast"],
  reviews: [
    {
      id: 1,
      user: "Guest User",
      date: "April 15, 2025",
      review:
        "The hotel is in a great location, safe and comfortable, with a beautiful environment, rich breakfast and a variety of dinner options. I like it very much. It is the best hotel in the area and is worth recommending. I...",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      user: "UNNYJIM",
      date: "April 12, 2025",
      review: "This is room view from window",
      image: "/placeholder.svg?height=40&width=40",
    },
  ],
  mostMentioned: [
    { label: "All reviews", count: 90 },
    { label: "Positive reviews", count: 85 },
    { label: "Reviews with photos/video", count: 28 },
    { label: "Awesome stay", count: 20 },
    { label: "Friendly staff", count: 19 },
    { label: "Delicious breakfast", count: 10 },
    { label: "Negative reviews", count: 5 },
  ],
  roomType: "Standard Room",
  roomSize: "25-37 m²",
  bedType: "1 king bed or 2 single beds",
  inclusions: ["Includes 2 great breakfasts", "Free Wi-Fi", "Non-smoking"],
  checkIn: {
    date: "Wed, May 7",
    time: "14:00-23:30",
  },
  checkOut: {
    date: "Thu, May 8",
    time: "06:30-12:00",
  },
  nights: 1,
  rooms: 1,
}
