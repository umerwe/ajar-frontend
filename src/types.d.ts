type ErrorResponse = {
  message: string;
};

type ProviderProps = {
  children: React.ReactNode
  messages?: Messages
  locale?: string
  dehydratedState: DehydratedState
}

interface SubCategory {
  _id?: string;
  name: string;
  slug?: string;
  icon?: string | { src: string };
}


interface Document {
  value: string;
  name: string;
  filesUrl: string[];
}

interface SkeletonLoaderProps {
  count?: number;
  variant?: string;
  isFav?: boolean;
  type ?: string
}

interface MarketplaceListingsProps {
  page?: number
  limit?: number
  subCategory?: string
  category ?: string
  currentPage?: number
  zone?: string
  minPrice ?: string
  maxPrice ?: string
}

interface Zone {
  _id : string
  name : string
}

interface ListingProps {
  params: Promise<{
    id: string
    category: string
  }>
}

interface Favourite {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  listing: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type User = {
  _id: string
  name: string
  email: string
  role: "user" | "admin" | "superadmin"
  status: "active" | "inactive" | "banned"
  profilePicture: string
  phone: string
  nationality: string
  createdAt: string
  updatedAt: string
  documents?: Array<{
    _id: string;
    name: string;
    filesUrl?: string[];
    status?: string;
  }>;
}

interface Article {
  _id: string;
  title: string;
  description: string;
  createdAt: string; // or Date if already parsed
  images?: string[]; // optional array of image URLs
}
