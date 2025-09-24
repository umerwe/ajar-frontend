export interface Listing  {
    ratings: {
      count: number;
      average: number;
    };
    _id: string;
    leaser: {
      _id: string;
      name: string;
      profilePicture: string;
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
    zone: string;
    name: string;
    images: string[];
    rentalImages: string[];
    description: string;
    address: string;
    Price: number;
    price: number;
    isActive: boolean;
    language: string;
    subTitle: string;
    currentBookingId : string
    facilities: string[];
    nearLocation: string[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  };