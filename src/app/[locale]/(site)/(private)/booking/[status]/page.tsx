"use client"

import Status from '@/components/pages/status/status';
import StatusOptions from '@/components/status-options';
import { useParams } from 'next/navigation'

const BookingPage = () => {
    const { status } = useParams();
    return (
        <>
            <StatusOptions />
            <Status status={status as string} />
        </>
    )
}

export default BookingPage