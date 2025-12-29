"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loader from "../common/loader"

export const ExtensionDialog = ({
    open,
    onOpenChange,
    onSubmit,
    minDate,
    isPending
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (date: string) => void
    minDate?: string,
    isPending?: boolean
}) => {
    const [date, setDate] = useState("")

    const handleSubmit = () => {
        if (!date) return
        const isoDate = new Date(date).toISOString()
        onSubmit(isoDate);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Extend Rental</DialogTitle>
                    <DialogDescription>
                        Choose the new date you wish to extend your rental to.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="extension-date" className="text-left">
                            New Date
                        </Label>
                        <Input
                            id="extension-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full block"
                            min={minDate}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!date || isPending}
                        className="bg-header hover:bg-header/90 text-white w-full sm:w-auto"
                    >
                        {isPending ? <Loader /> : "Confirm Extension"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
