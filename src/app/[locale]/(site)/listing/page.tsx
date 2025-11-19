"use client";

import { useSearchParams } from "next/navigation";
import ListingContent from "@/components/listing-content";
import Status from "@/components/pages/status/status";

const ListingPage = () => {
  const searchParams = useSearchParams();
  
  const status = searchParams.get("status");

  return (
    <div>
      {status ? (
        <Status status={status} />
      ) : (
        <ListingContent />
      )}
    </div>
  );
};

export default ListingPage;
