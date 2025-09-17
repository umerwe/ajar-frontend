"use client"

import Link from "next/link";
import { useState } from "react";

const LowerTabs = ({ id }: { id: string }) => {
    const lowerTabs = ['Rooms', 'Guest Reviews', 'Services & Amenities', 'Policies'];
    const [activesTab, setActivesTab] = useState('Rooms');

    return (
        <div className="mt-8 border-b">
            <div className="overflow-x-auto scrollbar-hide">
                <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 text-gray-700 text-xs sm:text-sm 2xl:text-lg font-medium min-w-max">
                    {lowerTabs.map((tab) => (
                        <li
                            key={tab}
                            onClick={() => setActivesTab(tab)}
                            className={`cursor-pointer pb-3 whitespace-nowrap ${activesTab === tab
                                ? 'border-b-2 border-black text-black font-semibold'
                                : 'hover:text-black'
                                }`}
                        >
                            <Link href={`/properties/${id}#${tab.toLowerCase()}`}>
                                {tab}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    )
}

export default LowerTabs