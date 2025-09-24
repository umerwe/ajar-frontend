"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-4">Please check your connection and
          try again.
        </p>
        <div className="flex gap-3 justify-center">
        <Button asChild variant="destructive" className="w-25">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
