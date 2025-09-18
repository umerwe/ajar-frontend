"use client";

import { useLayoutVisibility } from "@/hooks/useLayoutVisibility";
import Navbar from "./navbar/navbar";
import SubCategories from "./sub-categories";
import { StatusOptions } from "./status-options";

const MainLayout = () => {
  const { showCategories, hasSearchParams } = useLayoutVisibility();

  return (
    <div>
      <Navbar />
      {showCategories && <SubCategories />}
      {hasSearchParams && <StatusOptions /> }
    </div>
  );
};

export default MainLayout;
