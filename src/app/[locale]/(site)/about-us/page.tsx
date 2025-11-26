import Image from 'next/image';

interface AboutUsSectionProps {
    className?: string;
}

export default function AboutUsSection({ className = '' }: AboutUsSectionProps) {
    return (
        <section className={`py-16 px-6 md:px-12 lg:px-20 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Content */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            ABOUT US
                        </h2>
                        <div className="space-y-4 max-w-[480px] text-gray-500 leading-relaxed">
                            <p>
                                At BuyOwn House Properties, we understand that buying, selling, or investing in property is a significant decision. That&apos;s why we are committed to providing exceptional service, personalized attention, and expert guidance to ensure your real estate journey is a seamless and rewarding experience. Our agency takes pride in our extensive knowledge of the local market. Whether you are looking for a dream home, a lucrative investment opportunity, or seeking to sell your property at the best possible price, we have the expertise and resources to meet your goals.experience. Our agency takes pride in our extensive knowledge of the local market. Whether you are looking for a dream home, a lucrative investment opportunity, or seeking to sell your property at the best possible price, we have the expertise and resources to meet your goals.
                            </p>
                        </div>
                    </div>

                    {/* Right Images Grid - Custom Layout */}
                    <div className="relative h-[500px] md:h-[600px]">
                        {/* Top Image */}
                        <div className="absolute top-0 left-[15%] right-0 h-[23%] rounded-xl overflow-hidden shadow-xl z-10">
                            <Image
                                src="/about/img-1.jpg"
                                alt="Luxury bedroom with mountain view"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Middle Right Image */}
                        <div className="absolute top-[27%] right-0 w-[85%] h-[32%] rounded-t-xl overflow-hidden shadow-xl z-20">
                            <Image
                                src="/about/img-2.jpg"
                                alt="Contemporary bedroom interior"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>

                        {/* Bottom Left Image */}
                        <div className="absolute bottom-40 left-4 w-[35%] h-[32%] z-40">
                            <div className="w-full h-full rounded-xl bg-white p-[10px]">
                                {/* this relative box is the containing block for next/image fill */}
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


                        {/* Hotels Badge */}
                        <div className="absolute bottom-[35%] left-[36%] bg-[#309EC4] text-white rounded-lg px-5 py-3 z-100">
                            <div className="text-2xl font-bold leading-tight">100k+</div>
                            <div className="text-base font-medium">Hotels</div>
                        </div>
                    </div>
                </div>

                {/* About the Company Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 -mt-3">
                    {/* Left Images Grid - Custom Layout */}
                    <div className="relative h-[500px] md:h-[600px]">
                        {/* Top Left Image - Woman at desk */}
                        <div className="absolute top-0 left-0 w-full right-[15%] h-[60%] rounded-2xl overflow-hidden shadow-xl z-20">
                            <Image
                                src="/about/img-4.jpg"
                                alt="Professional woman working at desk"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Daily Active Users Badge */}
                        <div className="absolute bottom-0 left-0 w-[40%] h-[35%] bg-header rounded-2xl shadow-xl z-30 flex flex-col items-center justify-center text-white">
                            <div className="text-5xl font-bold leading-tight">500K</div>
                            <div className="text-lg font-medium mt-2">Daily Active Users</div>
                        </div>

                        {/* Bottom Right Image - Team meeting */}
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

                    {/* Right Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#1a2b3c]">
                            About the Company
                        </h2>
                        <div className="space-y-3 text-gray-500 leading-relaxed">
                            <p>
                                Our company has successfully implemented more than 50 turnkey projects in Uzbekistan with a client-oriented approach, engineering solutions, and optimal project capabilities, including design, supply, installation, and after-sales service of equipment.
                            </p>
                            <p>
                                Absolute Energy will continue to meet the needs of its clients with the same seriousness and determination in the future as in the past.
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-gray-900">Design –</span>
                                    <span className="text-gray-600"> design of small and medium-capacity systems; equipment and cable layout planning; preparation of diesel power plant documentation; calculation of electrical installation capacities; calculations and plans of feeder networks; electrical panel calculations; load calculations; grounding contour plans; fuel supply system; automation and fire-safety systems.</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Supply –</span>
                                    <span className="text-gray-600"> generator preparation; factory inspection at the manufacturer; arrangement of transport and shipping documents; customs clearance; certification of supplied goods.</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Installation –</span>
                                    <span className="text-gray-600"> installation, assembly, and setup. Training personnel for generator operations.</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Service & Maintenance –</span>
                                    <span className="text-gray-600"> we provide support in areas such as maintenance, repairs, spare parts supply, installation, and commissioning. With fast response, we offer solutions for your business with minimal downtime. Mechanical and electrical adjustments to bring the facility up to standard; installation; commissioning work; repairs; maintenance tasks; power connection modifications.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 mb-16">
                    {/* Projects */}
                    <div className="text-center relative border-r">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">98</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">Projects</h3>
                        </div>
                    </div>

                    {/* People */}
                    <div className="text-center relative border-r">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">65</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">People</h3>
                        </div>
                    </div>

                    {/* Years */}
                    <div className="text-center relative border-r">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">10</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">Years</h3>
                        </div>
                    </div>

                    {/* Offices */}
                    <div className="text-center relative">
                        <div className="text-[120px] font-bold text-gray-200 leading-none">15</div>
                        <div className="absolute inset-0 flex items-center justify-center pt-3">
                            <h3 className="text-xl font-bold text-[#1a2b3c]">Offices</h3>
                        </div>
                    </div>
                </div>

                {/* What Sets Us Apart Section */}
                <div className="text-center mt-16 mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1a2b3c] mb-6">
                        What Sets Us Apart?
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                        At Ajar, we take pride in offering more than just products; we offer an experience. Here&apos;s what makes us unique:
                    </p>
                </div>
            </div>
        </section>
    );
}