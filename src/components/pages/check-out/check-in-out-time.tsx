"use client"

import { type FC, type ReactNode, useState } from "react"
import type React from "react"

interface CheckInOutTimeProps {
  date?: string
  icon: ReactNode
  label: string
  options: { label: string; value: number }[]
}

const CheckInOutTime: FC<CheckInOutTimeProps> = ({ date, icon, label, options }) => {
  const [nights, setNights] = useState(1)
  const [rooms, setRooms] = useState(1)

  const value = label === "night" || label === "rental day" ? nights : rooms

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number.parseInt(e.target.value)
    if (label === "night" || label === "rental day") {
      setNights(newValue)
    } else {
      setRooms(newValue)
    }
  }

  // ✅ Format date as "Wed, Aug 1"
  const formattedDate = date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date(date))
    : ""

  const formattedTime = date
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(date))
    : ""

  return (
    <div>
      {formattedDate && (
        <h4 className="font-semibold text-gray-900 mb-1">{formattedDate}</h4>
      )}
      {formattedTime && (
        <p className="text-sm text-gray-600">{formattedTime}</p>
      )}

      <div className="flex items-center gap-2 mt-2">
        {icon}
        <select
          value={value}
          onChange={handleChange}
          className="text-sm border-none focus:outline-none focus:ring-0"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default CheckInOutTime
