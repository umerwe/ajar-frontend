"use client"

import { useBooking } from '@/hooks/useBooking'
import React from 'react'

const Page = () => {
    const { data } = useBooking();
    console.log(data)
    return (
        <div>

        </div>
    )
}

export default Page
