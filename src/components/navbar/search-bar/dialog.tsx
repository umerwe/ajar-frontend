"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchBar, SearchBarSchema } from "@/validations/search-bar"
import { useRouter } from "next/navigation"

export default function SearchBarDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SearchBar>({
        resolver: zodResolver(SearchBarSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = (data: SearchBar) => {
        router.push(`/search?name=${encodeURIComponent(data.name)}`)
        reset()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="font-semibold text-[17px] rounded-full h-12 sm:h-14 lg:h-16 w-full sm:w-36 lg:w-39 xl:w-44 flex items-center justify-center gap-2"
                >
                    Search
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <VisuallyHidden>
                    <DialogTitle>Search</DialogTitle>
                </VisuallyHidden>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div className="relative">
                        <Input
                            {...register("name")}
                            placeholder="Search..."
                            autoFocus
                            className={errors.name ? "border-red-500" : ""}
                        />
                        <Search
                            onClick={handleSubmit(onSubmit)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer hover:text-gray-600"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
