"use client"

import Link from 'next/link';
import React, { useState } from 'react'

const UpperTabs = ({ id }: { id: string }) => {
    const upperTabs = ['Overview', 'About', 'Rooms', 'Accessibility', 'Policies'];
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="mb-6 sm:px-3 mt-2 border-b-1">
            <div className="overflow-x-auto scrollbar-hide">
                <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 text-gray-700 text-xs sm:text-sm 2xl:text-lg font-semibold border-b-1 min-w-max">
                    {upperTabs.map((tab) => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer pb-2 whitespace-nowrap ${activeTab === tab
                                ? 'border-b-2 border-aqua text-aqua'
                                : 'hover:text-aqua'
                                }`}
                        >
                            <Link href={`/properties/${id}#${tab.toLowerCase()}`}>
                                {tab}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UpperTabs