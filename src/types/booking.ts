export type Booking = {
  dates: {
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
  };
  priceDetails: {
    price: number;
    adminFee: number;
    totalPrice: number;
  };
  extensionCharges: {
    adminFee: number;
    additionalCharges: number;
    totalPrice: number;
  };
  actualReturnedAt: string | null;
  _id: string;
  status: "completed" | "pending" | "cancelled" | string; // extend as needed
  renter: string;
  marketplaceListingId: string | null;
  noOfGuests: number;
  roomType: string;
  phone: string;
  language: string;
  languages: {
    locale: string;
    translations: {
      roomType: string;
      bookingNote: string;
    };
    _id: string;
  }[];
  otp: string;
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

