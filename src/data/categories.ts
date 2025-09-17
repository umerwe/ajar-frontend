import { LucideIcon, AArrowDownIcon, BedSingle, CarFront, Home } from "lucide-react"
import { BuildingOffice2Icon } from "@heroicons/react/24/outline"

export interface Category {
  name: string
  icon: LucideIcon | typeof BuildingOffice2Icon
  link: string
}

export const categories: Category[] = [
  {
    name: "All",
    icon: AArrowDownIcon,
    link: "/listing",
  },
  {
    name: "Property",
    icon: Home,
    link: "/listing/prp567",
  },
  {
    name: "Vehicles",
    icon: CarFront,
    link: "/listing/veh341",
  },
  {
    name: "Rooms",
    icon: BedSingle,
    link: "/listing/room567",
  },
  {
    name: "Appartments",
    icon: BuildingOffice2Icon,
    link: "/listing/aprt987",
  },
]
