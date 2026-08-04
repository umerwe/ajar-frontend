export interface Zone {
  _id?: string;
  name: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListingLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Listing  {
  bookingId : string;
    _id: string;
    leaser: {
      _id: string;
      name: string;
      profilePicture: string;
      email : string;
      phone: string;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
    };
    status : string
    isGuestFavorite : string
    subCategory: {
      _id: string;
      name: string;
      type: "subCategory";
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
    };
    zone: Zone;
    location: ListingLocation;
    name: string;
    images: string[];
    rentalImages: string[];
    description: string;
    address: string;
    Price: number;
    price: number;
    dynamicPricing?: {
      price: number;
      startDate: string;
      endDate: string;
    } | null;
    priceUnit : string;
    isActive: boolean;
    language: string;
    subTitle: string;
    currentBookingId : string
    facilities: string[];
    nearLocation: string[];
    documents: Document[];
    createdAt: string; 
    updatedAt: string; 
    adminFee : number;
    tax : number;
    totalReviews : number;
    averageRating : number;
    __v: number;
  };
