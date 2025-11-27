"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
// import Autoplay from "embla-carousel-autoplay"
import { testimonialsData } from "@/data/testimonials"
import { ChevronLeft, ChevronRight } from "lucide-react" // Import icons for arrows

export default function AboutUsSection() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    // Add state for button visibility to ensure we don't try to scroll if the API is not ready
    const [isApiReady, setIsApiReady] = useState(false) 

    useEffect(() => {
        if (!api) return

        setIsApiReady(true) // Set API ready state
        setCurrent(api.selectedScrollSnap())
        
        const handleSelect = () => setCurrent(api.selectedScrollSnap())
        api.on("select", handleSelect)
        
        return () => {
            api.off("select", handleSelect)
        }
    }, [api])

    const handleDotClick = (index: number) => {
        if (api) {
            api.scrollTo(index)
        }
    }

    // Handlers for arrow clicks
    const handlePrev = () => {
        if (api) {
            api.scrollPrev()
        }
    }

    const handleNext = () => {
        if (api) {
            api.scrollNext()
        }
    }

    const currentTestimonial = testimonialsData[current]

    return (
        <section className={`py-8 md:py-16`}>
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-6 md:px-12">
                    {/* Left Content */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">ABOUT US</h2>
                        <div className="space-y-4 max-w-[480px] text-gray-500 leading-relaxed">
                            <p>
                                At BuyOwn House Properties, we understand that buying, selling, or investing in property is a
                                significant decision. That&apos;s why we are committed to providing exceptional service, personalized
                                attention, and expert guidance to ensure your real estate journey is a seamless and rewarding
                                experience. Our agency takes pride in our extensive knowledge of the local market. Whether you are
                                looking for a dream home, a lucrative investment opportunity, or seeking to sell your property at the
                                best possible price, we have the expertise and resources to meet your goals.
                            </p>
                        </div>
                    </div>

                    {/* Right Images Grid - Custom Layout */}
                    <div className="relative h-[500px] md:h-[600px]">
                        <div className="absolute top-0 left-[15%] right-0 h-[23%] rounded-xl overflow-hidden shadow-xl z-10">
                            <Image
                                src="/about/img-1.jpg"
                                alt="Luxury bedroom with mountain view"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        <div className="absolute top-[27%] right-0 w-[85%] h-[32%] rounded-t-xl overflow-hidden shadow-xl z-20">
                            <Image
                                src="/about/img-2.jpg"
                                alt="Contemporary bedroom interior"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                        <div className="absolute bottom-40 left-4 w-[35%] h-[32%] z-40">
                            <div className="w-full h-full rounded-xl bg-white p-[10px]">
                                <div className="relative w-full h-full rounded-lg overflow-hidden">
                                    <Image
                                        src="/about/img-3.jpg"
                                        alt="Modern hotel room with city view"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 30vw"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-[35%] left-[36%] bg-[#309EC4] text-white rounded-lg px-5 py-3 z-50">
                            <div className="text-2xl font-bold leading-tight">100k+</div>
                            <div className="text-base font-medium">Hotels</div>
                        </div>
                    </div>
                </div>

                {/* About the Company Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 -mt-3 max-w-7xl mx-auto px-6 md:px-12">
                    <div className="relative h-[500px] md:h-[600px]">
                        <div className="absolute top-0 left-0 w-full right-[15%] h-[60%] rounded-2xl overflow-hidden shadow-xl z-20">
                            <Image
                                src="/about/img-4.jpg"
                                alt="Professional woman working at desk"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 w-[40%] h-[35%] bg-header rounded-2xl shadow-xl z-30 flex flex-col items-center justify-center text-white">
                            <div className="text-5xl font-bold leading-tight">500K</div>
                            <div className="text-lg font-medium mt-2">Daily Active Users</div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-[57%] h-[35%] rounded-2xl overflow-hidden shadow-xl z-10">
                            <Image
                                src="/about/img-6.jpg"
                                alt="Team meeting discussion"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#1a2b3c]">About the Company</h2>
                        <div className="space-y-3 text-gray-500 leading-relaxed">
                            <p>
                                Our company has successfully implemented more than 50 turnkey projects in Uzbekistan with a
                                client-oriented approach, engineering solutions, and optimal project capabilities, including design,
                                supply, installation, and after-sales service of equipment.
                            </p>
                            <p>
                                Absolute Energy will continue to meet the needs of its clients with the same seriousness and
                                determination in the future as in the past.
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-gray-900">Design –</span>{" "}
                                    <span className="text-gray-600">
                                        design of small and medium-capacity systems; equipment and cable layout planning; preparation of
                                        diesel power plant documentation; calculation of electrical installation capacities; calculations
                                        and plans of feeder networks; electrical panel calculations; load calculations; grounding contour
                                        plans; fuel supply system; automation and fire-safety systems.
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Supply –</span>{" "}
                                    <span className="text-gray-600">
                                        generator preparation; factory inspection at the manufacturer; arrangement of transport and shipping
                                        documents; customs clearance; certification of supplied goods.
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Installation –</span>{" "}
                                    <span className="text-gray-600">
                                        installation, assembly, and setup. Training personnel for generator operations.
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Service & Maintenance –</span>{" "}
                                    <span className="text-gray-600">
                                        we provide support in areas such as maintenance, repairs, spare parts supply, installation, and
                                        commissioning. With fast response, we offer solutions for your business with minimal downtime.
                                        Mechanical and electrical adjustments to bring the facility up to standard; installation;
                                        commissioning work; repairs; maintenance tasks; power connection modifications.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 mb-16 max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center relative border-r">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">98</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">Projects</h3>
                        </div>
                    </div>
                    <div className="text-center relative border-r">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">65</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">People</h3>
                        </div>
                    </div>
                    <div className="text-center relative border-r">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">10</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">Years</h3>
                        </div>
                    </div>
                    <div className="text-center relative">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">15</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">Offices</h3>
                        </div>
                    </div>
                </div>

                {/* What Sets Us Apart Section */}
                <div className="text-center mt-20 mb-12 max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="text-4xl font-bold text-[#1a2b3c] mb-2">What Sets Us Apart?</h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                        At Ajar, we take pride in offering more than just products; we offer an experience. Here&apos;s what makes
                        us unique:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto px-6 md:px-12">
                    <div className="bg-gray-50 border-1 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-5xl font-bold text-gray-300">01</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b3c] mb-3">Quality Assurance</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Every vase in our collection is carefully curated to ensure the highest quality standards.
                        </p>
                        <a
                            href="#"
                            className="text-[#1a2b3c] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Learn more →
                        </a>
                    </div>
                    <div className="bg-gray-50 border-1 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-5xl font-bold text-gray-300">02</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b3c] mb-3">Exclusive Designs</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We work closely with talented ceramic artists to bring you exclusive and one-of-a-kind designs.
                        </p>
                        <a
                            href="#"
                            className="text-[#1a2b3c] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Learn more →
                        </a>
                    </div>
                    <div className="bg-gray-50 border-1 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-5xl font-bold text-gray-300">03</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b3c] mb-3">Ease of Cleaning</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Ceramic vases are relatively easy to clean. You can simply wash them with mild soap.
                        </p>
                        <a
                            href="#"
                            className="text-[#1a2b3c] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Learn more →
                        </a>
                    </div>
                </div>

                <div className="mt-20 text-center bg-gray-100 py-10">
                    <h3 className="font-bold text-[#1a2b3c] uppercase tracking-wider mb-3">
                        Trusted by over 1K+ Companies
                    </h3>

                    <div className="w-full max-w-6xl mx-auto">
                        <Image
                            src="/about/logos.png"
                            alt="Trusted By"
                            width={700}
                            height={100}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                <div className="mt-24 max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#1a2b3c] mb-2">What Our Happy Clients Say</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">Several selected clients, who already believe in our service.</p>
                    </div>

                    {/* Static card wrapper - NOW RELATIVE for arrow positioning */}
                    <div className="w-full max-w-4xl mx-auto px-4 pb-12 relative">
                        
                        {/* LEFT ARROW BUTTON */}
                        <button
                            onClick={handlePrev}
                            disabled={!isApiReady}
                            className="absolute z-50 top-1/2 left-0 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                            aria-label="Previous Testimonial"
                        >
                            <ChevronLeft className="h-5 w-5 text-[#1a2b3c]" />
                        </button>
                        
                        {/* RIGHT ARROW BUTTON */}
                        <button
                            onClick={handleNext}
                            disabled={!isApiReady}
                            className="absolute z-50 top-1/2 right-0 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                            aria-label="Next Testimonial"
                        >
                            <ChevronRight className="h-5 w-5 text-[#1a2b3c]" />
                        </button>

                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 ring-8 ring-white shadow-2xl">
                                    <Image
                                        key={`image-${currentTestimonial.id}`}
                                        src={currentTestimonial.image || "/placeholder.svg"}
                                        alt={currentTestimonial.name}
                                        fill
                                        className="object-cover animate-in fade-in duration-500"
                                        sizes="128px"
                                    />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-[#1a2b3c] mb-4 animate-in fade-in duration-500">
                                        {currentTestimonial.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-lg animate-in fade-in duration-500">
                                        &quot;{currentTestimonial.testimonial}&quot;
                                    </p>

                                    {/* Dots - sync with carousel index */}
                                    <div className="flex gap-2 mt-6 justify-center md:justify-start">
                                        {testimonialsData.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDotClick(index)}
                                                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${index === current ? "w-8 bg-header" : "w-2 bg-gray-300"
                                                    }`}
                                                aria-label={`Go to testimonial ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "center",
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {testimonialsData.map((testimonial) => (
                                    <CarouselItem key={testimonial.id} className="basis-full">
                                        <div>{testimonial.name}</div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    )
}