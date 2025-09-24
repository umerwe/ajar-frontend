"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gray-50 rounded-2xl shadow-sm border py-6 px-12">
          <div className="mb-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No listings found
          </h3>
          <p className="text-gray-600 mb-6">
            No listings available at the moment. Check back later for new
            properties.
          </p>
          <Button asChild variant="destructive">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
