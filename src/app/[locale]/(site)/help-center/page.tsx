import { Search, ArrowRight, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { helpCategories } from '@/data/helpCategories';

const HelpCenter = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background */}
            <div className="relative mt-12 bg-header overflow-hidden flex justify-between rounded-md mx-4 md:mx-15">
                <div className="relative max-w-7xl flex items-center mx-5 md:mx-10 py-6 lg:py-6 xl:py-8">
                    <div className="max-w-2xl">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Help Center</h2>
                        <p className="text-emerald-100 mb-4 text-sm md:text-base">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search"
                                className="pl-9 w-60 md:w-80 h-9 md:h-12 text-sm sm:text-base bg-white border-0 focus:bg-white"
                            />
                        </div>
                    </div>
                </div>
                <div className='hidden lg:block'>
                    <Image
                        src="/topographic-img.png"
                        alt="Topographic background"
                        width={450}
                        height={450}
                        className="object-cover mix-blend-overlay"
                        priority
                    />
                </div>
            </div>
            <div className="mx-4 md:mx-15 py-15">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {helpCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <Card
                                key={index}
                                className="hover:shadow-lg transition-shadow duration-300 border-1 border-gray-200 shadow-sm"
                            >
                                <CardContent className="px-4 py-3">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                                            <Icon className="w-6 h-6 text-blue-500" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        {category.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {category.description}
                                    </p>

                                    <Button className="text-header hover:text-emerald-600 font-medium shadow-none">
                                        <span className="mb-0.5">Learn more</span>
                                        <ChevronRight className="w-10 h-10 text-aqua -ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-gray-100 relative">
                <div className=" mx-auto px-4 sm:px-6 lg:px-16 pt-15 pb-10 xl:px-40">
                    <Image
                        src={'/help-icon.png'}
                        alt='help-icon'
                        width={40}
                        height={40}
                        className='hidden lg:absolute lg:block bottom-34 left-115'
                    />
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="text-center lg:text-left mb-8 lg:mb-0">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                Still have questions ?
                            </h3>
                            <p className="text-gray-600">
                                Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
                            </p>
                        </div>

                        <div className="flex items-center relative">
                            <Button className="bg-white hover:bg-gray-200 text-black px-7 py-5 rounded-md text-base font-medium">
                                Get in Touch
                                <ArrowRight className="w-4 h-4" />
                            </Button>

                            <Image
                                src={'/help-icon.png'}
                                alt='help-icon'
                                width={30}
                                height={30}
                                className='lg:absolute top-5 right-60 hidden lg:block'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;


//   <header className="bg-white mx-4 md:mx-15">
//                 <div className="py-8">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">

//                         {/* Left Side: Welcome Text */}
//                         <div className="flex flex-col">
//                             <h1 className="text-lg sm:text-xl xl:text-2xl font-semibold text-gray-900">Welcome, Amanda</h1>
//                             <p className="text-sm xl:text-lg text-gray-500">Tue, 07 June 2022</p>
//                         </div>

//                         {/* Right Side: Search & Icons */}
//                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                             <div className="relative w-full sm:w-64 xl:w-74">
//                                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                                 <Input
//                                     placeholder="Search"
//                                     className="pl-9 pb-1 w-full h-10 bg-gray-100 text-sm xl:text-md"
//                                 />
//                             </div>

//                             {/* Notification & Profile Icons */}
//                             <div className="flex items-center gap-2 sm:gap-3 justify-end max-[768px]:absolute top-2 right-0">
//                                 <Button variant="ghost" size="icon" className="hover:bg-gray-100">
//                                     <Bell className="w-5 h-5" />
//                                 </Button>
//                                 <Button variant="ghost" size="icon" className="bg-gray-200 hover:bg-gray-300">
//                                     <User className="w-5 h-5" />
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </header>