import { DropdownBtn } from "@/components/ui/dropdown-menu";
import { User, ChevronDown } from "lucide-react";

export default function PassengerDropdown() {
  return (
    <DropdownBtn>
      <div className="flex cursor-pointer lg:-ml-3 xl:ml-0 items-center gap-3 pt-4 lg:pt-0 pr-5 border-t lg:border-t-0 border-gray-200">
        <User className="text-gray-400 flex-shrink-0 w-5 h-5" />
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-xs sm:text-sm text-gray-500">Passengers</p>
          <p className="font-bold text-xs lg:text-sm text-gray-900">4 adults</p>
        </div>
        <div className="flex-shrink-0 ml:3 xl:ml-5">
          <ChevronDown className="text-gray-400 w-5 h-5" strokeWidth={3} />
        </div>
      </div>
    </DropdownBtn>
  );
}
