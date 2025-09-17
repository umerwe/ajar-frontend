import type { LucideIcon } from "lucide-react";

import {
  Car,
  Wine,
  Dumbbell,
  UtensilsCrossed,
  Plane,
  Waves,
  Shirt,
  Wifi,
  SpadeIcon as Spa,
  Building2,
  ParkingCircle,
  Users,
  Baby,
  MapPin,
  GiftIcon as Massage,
  DollarSign,
  GuitarIcon as Golf,
  ShowerHeadIcon as SwimmingPool,
  CarFront,
  Coffee,
  Luggage,
  PiIcon as PingPong,
  ShowerHead,
  Clock,
  ShoppingBag,
  Utensils,
  Bed,
  AnvilIcon as Iron,
  WashingMachine,
  Calendar,
  Cigarette,
  FlameIcon as Grill,
  Gift,
  CreditCard,
  Accessibility,
} from "lucide-react"

export interface Amenity {
  id: string;
  name: string;
  icon: LucideIcon;
  isFree?: boolean;
  hasAdditionalCharge?: boolean;
  description?: string;
}

export interface AmenityCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  amenities: Amenity[];
}

export const mostPopularAmenities: Amenity[] = [
  {
    id: "airport-pickup",
    name: "Priority airport pick-up",
    icon: Plane,
    isFree: true,
  },
  {
    id: "spa",
    name: "Spa",
    icon: Spa,
    hasAdditionalCharge: true,
  },
  {
    id: "golf-course",
    name: "Golf course",
    icon: Golf,
  },
  {
    id: "bar",
    name: "Bar",
    icon: Wine,
  },
  {
    id: "business-center",
    name: "Business center",
    icon: Building2,
  },
  {
    id: "outdoor-pool",
    name: "Outdoor swimming pool",
    icon: SwimmingPool,
  },
  {
    id: "gym",
    name: "Gym",
    icon: Dumbbell,
  },
  {
    id: "private-parking",
    name: "Private parking",
    icon: ParkingCircle,
    hasAdditionalCharge: true,
  },
  {
    id: "car-rentals",
    name: "Car rentals",
    icon: CarFront,
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: UtensilsCrossed,
  },
  {
    id: "conference-room",
    name: "Conference room",
    icon: Users,
  },
  {
    id: "cafe",
    name: "Cafe",
    icon: Coffee,
  },
  {
    id: "airport-shuttle",
    name: "Airport shuttle drop-off",
    icon: Car,
    isFree: true,
  },
  {
    id: "childcare",
    name: "Childcare service",
    icon: Baby,
  },
  {
    id: "luggage-storage",
    name: "Luggage storage",
    icon: Luggage,
  },
  {
    id: "hot-springs",
    name: "Hot springs",
    icon: Waves,
  },
  {
    id: "tour-booking",
    name: "Tour and ticket booking service",
    icon: MapPin,
  },
  {
    id: "table-tennis",
    name: "Table tennis room",
    icon: PingPong,
  },
  {
    id: "laundry-room",
    name: "Laundry room",
    icon: WashingMachine,
  },
  {
    id: "massage-room",
    name: "Massage room",
    icon: Massage,
  },
  {
    id: "sauna",
    name: "Sauna",
    icon: ShowerHead,
  },
  {
    id: "wifi-public",
    name: "Wi-Fi in public areas",
    icon: Wifi,
  },
  {
    id: "currency-exchange",
    name: "Currency exchange",
    icon: DollarSign,
  },
  {
    id: "front-desk",
    name: "24-hour front desk",
    icon: Clock,
  },
]

export const moreAmenitiesCategories: AmenityCategory[] = [
  {
    id: "internet",
    title: "Internet",
    icon: Wifi,
    amenities: [
      {
        id: "wifi-public-areas",
        name: "Wi-Fi in public areas",
        icon: Wifi,
      },
    ],
  },
  {
    id: "food-drink",
    title: "Food & Drink",
    icon: UtensilsCrossed,
    amenities: [
      {
        id: "bar-food",
        name: "Bar",
        icon: Wine,
      },
      {
        id: "room-service",
        name: "Room service",
        icon: Bed,
      },
      {
        id: "cafe-food",
        name: "Cafe",
        icon: Coffee,
      },
      {
        id: "lobby-bar",
        name: "Lobby bar",
        icon: Wine,
      },
      {
        id: "snack-bar",
        name: "Snack bar",
        icon: Utensils,
      },
    ],
  },
  {
    id: "cleaning-services",
    title: "Cleaning Services",
    icon: Shirt,
    amenities: [
      {
        id: "ironing-service",
        name: "Ironing service",
        icon: Iron,
      },
      {
        id: "dry-cleaning",
        name: "Dry cleaning",
        icon: Shirt,
      },
      {
        id: "laundry-onsite",
        name: "Laundry service (on-site)",
        icon: WashingMachine,
      },
      {
        id: "laundry-offsite",
        name: "Laundry service (off-site)",
        icon: WashingMachine,
      },
      {
        id: "laundry-room-cleaning",
        name: "Laundry room",
        icon: WashingMachine,
      },
    ],
  },
  {
    id: "outdoor-pool",
    title: "Outdoor swimming pool",
    icon: SwimmingPool,
    amenities: [
      {
        id: "opening-times",
        name: "Opening times",
        icon: Calendar,
      },
    ],
  },
  {
    id: "parking",
    title: "Parking",
    icon: ParkingCircle,
    amenities: [
      {
        id: "private-parking-guests",
        name: "Private (exclusively for guests) is available On-site parking. Reservation not needed.",
        icon: ParkingCircle,
        description: "Private parking for guests",
      },
      {
        id: "valet-parking",
        name: "Valet parking",
        icon: Car,
        hasAdditionalCharge: true,
      },
      {
        id: "private-parking-charge",
        name: "Private parking",
        icon: ParkingCircle,
        hasAdditionalCharge: true,
      },
    ],
  },
  {
    id: "transportation",
    title: "Transportation",
    icon: Car,
    amenities: [
      {
        id: "priority-pickup",
        name: "Priority airport pick-up",
        icon: Plane,
        isFree: true,
      },
      {
        id: "car-rentals-transport",
        name: "Car rentals",
        icon: CarFront,
      },
    ],
  },
  {
    id: "public-areas",
    title: "Public Areas",
    icon: Building2,
    amenities: [
      {
        id: "executive-floor",
        name: "Executive floor",
        icon: Building2,
      },
      {
        id: "smoking-area",
        name: "Smoking area",
        icon: Cigarette,
      },
      {
        id: "shopping-mall",
        name: "Shopping mall",
        icon: ShoppingBag,
      },
      {
        id: "bbq",
        name: "BBQ",
        icon: Grill,
      },
      {
        id: "gift-shop",
        name: "Gift shop",
        icon: Gift,
      },
      {
        id: "atm",
        name: "ATM",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "facilities-children",
    title: "Facilities for Children",
    icon: Baby,
    amenities: [
      {
        id: "children-meals",
        name: "Children's meals available",
        icon: Utensils,
      },
      {
        id: "childcare-service",
        name: "Childcare service",
        icon: Baby,
      },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    icon: Accessibility,
    amenities: [
      {
        id: "accessible-rooms",
        name: "Accessible rooms available",
        icon: Accessibility,
      },
    ],
  },
]

export const restaurantInfo = {
  title: "Restaurant",
  description: "No additional info available",
  icon: UtensilsCrossed,
}
