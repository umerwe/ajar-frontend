import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const LogoutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClick = () => {
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    router.replace("/auth/login");
  };

  return (
    <div
      onClick={handleClick}
      className="block px-4 py-2 text-sm transition-colors duration-150
       cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700">
      Logout
    </div>
  );
};

export default LogoutButton;
