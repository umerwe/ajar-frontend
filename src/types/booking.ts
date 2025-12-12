export type Booking = {
  _id: string;
  status: "completed" | "pending" | "cancelled" | "active" | string;
  
  // Updated to match the populated renter object in your JSON
  renter: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    phone?: string;
    nationality?: string;
    role?: string;
  } | string;

  // Updated to match the populated listing object
  marketplaceListingId: {
    _id: string;
    name: string;
    subTitle?: string;
    rentalImages?: string[];
    images?: string[];
    address?: string;
    price?: number;
  } | string;

  dates: {
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
  };

  // Updated to include tax
  priceDetails: {
    price: number;
    adminFee: number;
    tax?: number; 
    totalPrice: number;
  };

  // Added based on your JSON
  extraRequestCharges?: {
    additionalCharges: number;
  };

  // Legacy field (kept if you still use it elsewhere)
  extensionCharges?: {
    adminFee: number;
    additionalCharges: number;
    totalPrice: number;
  };

  specialRequest?: string;
  isExtend?: boolean;
  
  // Other fields from your original type
  actualReturnedAt?: string | null;
  noOfGuests?: number;
  roomType?: string;
  phone?: string;
  language?: string;
  languages?: {
    locale: string;
    translations: {
      roomType: string;
      bookingNote: string;
    };
    _id: string;
  }[];
  otp?: string;
  paymentStatus : string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BookingRequest = {
  marketplaceListingId: string;
  dates: {
    checkIn: string;   // ISO string
    checkOut: string;  // ISO string
  };
  specialRequest: string;
};

