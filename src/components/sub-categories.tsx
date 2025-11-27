"use client";
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSubCategories } from "@/hooks/useSubCategory";
import Dropdown from "@/components/ui/dropdown";
import SkeletonLoader from "./common/skeleton-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/utils/capitalizeWords";

const statusOptions = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];

const SubCategories = () => {
  const { data = [], isLoading } = useSubCategories();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  if (isLoading) {
    return <SkeletonLoader variant="subcategories" count={7} />;
  }

  const subCategoryParam =
    searchParams.get("category_id") || (params.category_id as string | null);

  const allSubCategory = { name: "All", slug: "all", icon: "/ai-logo.png" };
  const subCategories = [allSubCategory, ...data];

  const activeSubCategory =
    subCategoryParam && subCategories.find((c) => c._id === subCategoryParam)
      ? subCategories.find((c) => c._id === subCategoryParam)!
      : allSubCategory;

  const getHref = (subCategory: SubCategory) =>
    subCategory.slug === "all" ? "/listing" : `/listing/${subCategory._id}`;

  const isActive = (subCategory: SubCategory) =>
    subCategory.slug === "all"
      ? !subCategoryParam || subCategoryParam === "all"
      : subCategoryParam === subCategory._id;

  const handleStatusSelect = (status: string) => {
    router.push(`/listing?status=${status.toLowerCase()}`);
  };

  const mobileButton = (
    <button
      className="w-full flex items-center justify-between gap-3 px-5 py-3 
        rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors
         duration-200 shadow-sm border-t-aqua border-r-aqua border-b-blue
          border-l-blue"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#01c89b]">
          {activeSubCategory.name}
        </span>
      </div>
      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
    </button>
  );

  const mobileContent = (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="py-2">
        {subCategories.map((cat, i) => {
          const active = isActive(cat);
          return (
            <Link
              key={i}
              href={getHref(cat)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${active && "bg-blue-50 border-r-4 border-aqua text-aqua"
                }`}
            >
              <span
                className={`text-sm font-medium text-gray-500 ${active && "text-aqua"
                  } `}
              >
                {capitalizeWords(cat.name)}
              </span>
              {active && <div className="ml-auto w-2 h-2 rounded-full bg-aqua"></div>}
            </Link>
          );
        })}
      </div>
    </div>
  );

  const filterButton = (
    <button
      className="p-2 rounded-lg border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue 
               bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm flex items-center gap-2
               focus:outline-none"
    >
      <AdjustmentsHorizontalIcon className="w-6 h-6 text-aqua" />
    </button>
  );

  const filterContent = (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="py-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusSelect(status)}
            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex justify-between px-4 sm:px-6 md:px-9 my-4">
      {/* Desktop */}
      <div className="hidden md:flex flex-wrap gap-3 flex-grow">
        {subCategories.slice(0, 6).map((cat, i) => {
          const active = isActive(cat);
          return (
            <Link
              key={i}
              href={getHref(cat)}
              className={`flex items-center gap-2 px-8 rounded-full transition-colors duration-200 ${active
                ? "text-aqua border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue bg-transparent"
                : "bg-gray-100 text-gray-400 border border-transparent hover:border-aqua hover:text-aqua"
                }`}
            >
              <span className="text-sm font-semibold">{capitalizeWords(cat.name)}</span>
            </Link>
          );
        })}

        {/* Show more button */}
        {subCategories.length > 6 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-full pl-8 py-5 bg-aqua/10 flex items-center gap-2"
              >
                Show all
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>All Categories</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-3 mt-4">
                {subCategories.map((cat, i) => {
                  const active = isActive(cat);
                  return (
                    <DialogTrigger asChild key={i}>
                      <Link
                        href={getHref(cat)}
                        className={`flex items-center gap-2 px-8 py-2 rounded-full transition-colors duration-200 ${active
                          ? "text-aqua border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue bg-transparent"
                          : "bg-gray-100 text-gray-400 border border-transparent hover:border-aqua hover:text-aqua"
                          }`}
                      >
                        <span className="text-sm font-semibold">{capitalizeWords(cat.name)}</span>
                      </Link>
                    </DialogTrigger>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>

      {/* Mobile */}
      <div className="md:hidden flex-grow max-w-50 relative">
        <Dropdown button={mobileButton} className="w-full">
          {mobileContent}
        </Dropdown>
      </div>

      {/* Filter */}
      <div className="relative">
        <Dropdown button={filterButton}>{filterContent}</Dropdown>
      </div>
    </div>
  );
};

export default SubCategories;
