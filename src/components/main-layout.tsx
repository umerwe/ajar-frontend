"use client";

import { useLayoutVisibility } from "@/hooks/useLayoutVisibility";
import Categories from "./categories";
import Navbar from "./navbar/navbar";

const MainLayout = () => {
  const { showCategories } = useLayoutVisibility();

  return (
    <div>
      <Navbar />
      {showCategories && <Categories />}
    </div>
  );
};

export default MainLayout;
