"use client"
import React, { useState } from 'react'
import Congratulations from '@/components/auth/congratulations'

const CongratulationsPage = () => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Congratulations open={open} onOpenChange={setOpen} />
    </div>
  )
}

export default CongratulationsPage