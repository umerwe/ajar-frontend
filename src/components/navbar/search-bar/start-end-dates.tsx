import { Calendar } from "lucide-react";

interface StartEndDatesProps {
    title: string;
    description: string;
}

const StartEndDates = ({ title, description }: StartEndDatesProps) => {
    return (
        <div className="flex items-center gap-4">
            <Calendar className="text-gray-400 w-5 h-5" />
            <div>
                <p className="text-xs lg:text-sm">{title}</p>
                <p className="font-bold text-gray-600 text-xs lg:text-sm">{description}</p>
            </div>
        </div>
    );
};

export default StartEndDates;
