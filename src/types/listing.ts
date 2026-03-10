export interface LatLng {
  lat: number;
  lng: number;
}

// Support for standard GeoJSON Polygon structure
export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][]; // Array of rings, each ring is an array of [lng, lat]
}

// Support for standard GeoJSON MultiPolygon structure
export interface GeoJSONMultiPolygon {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

export interface Zone {
  _id?: string;
  name: string;
  currency?: string;
  // Polygons can come from the frontend as LatLng arrays 
  // or from the backend as GeoJSON objects
  polygons: LatLng[][] | GeoJSONPolygon | GeoJSONMultiPolygon;
  createdAt?: string;
  updatedAt?: string;
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
    name: string;
    images: string[];
    rentalImages: string[];
    description: string;
    address: string;
    Price: number;
    price: number;
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