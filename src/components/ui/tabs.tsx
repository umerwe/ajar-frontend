"use client";

import Link from "next/link";
import { useState } from "react";

interface TabsProps {
    id: string;
    defaultActive?: string;
    activeClass?: string;
    inactiveClass?: string;
}

const Tabs = ({
    id,
    defaultActive,
    activeClass = "border-b-2 border-black text-black font-semibold",
    inactiveClass = "hover:text-black",
}: TabsProps) => {
    const tabs = defaultActive === "Overview" ?
        ['Overview', 'About', 'Rooms', 'Accessibility', 'Policies'] :
        ['Rooms', 'Guest Reviews', 'Services & Amenities', 'Policies'];
        
    const [activeTab, setActiveTab] = useState(defaultActive || tabs[0]);
    
    return (
        <div className="overflow-x-auto scrollbar-hide border-b mb-6 sm:px-3">
            <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 text-gray-700 text-xs sm:text-sm 2xl:text-lg font-medium min-w-max">
                {tabs.map((tab) => (
                    <li
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer pb-2 whitespace-nowrap ${activeTab === tab ? activeClass : inactiveClass
                            }`}
                    >
                        <Link href={`/properties/${id}#${tab.toLowerCase()}`}>{tab}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tabs;
