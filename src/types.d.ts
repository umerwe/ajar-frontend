type ErrorResponse = {
  message: string;
};

type ProviderProps = {
  children: React.ReactNode
  messages?: Messages
  locale?: string
  dehydratedState: DehydratedState
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
}

interface MarketplaceListingsProps {
  page?: number
  limit?: number
  subCategory?: string
  currentPage?: number
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
