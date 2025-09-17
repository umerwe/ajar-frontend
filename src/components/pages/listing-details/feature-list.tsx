import {
    Check,
    AirVent,
    Martini,
    ParkingSquare,
    Utensils,
    Wifi,
} from "lucide-react";

const FeaturesList = ({ property }: {property : Listing}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm max-w-140">
            {
                property.facilities.map((feature) => {
                    let IconComponent;
                    switch (feature.toLowerCase()) {
                        case "breakfast included":
                            IconComponent = (
                                <Utensils className="w-5 h-5" />
                            );
                            break;
                        case "parking available":
                            IconComponent = (
                                <ParkingSquare className="w-5 h-5" />
                            );
                            break;
                        case "air conditioning":
                            IconComponent = (
                                <AirVent className="w-5 h-5" />
                            );
                            break;
                        case "bar":
                            IconComponent = (
                                <Martini className="w-5 h-5" />
                            );
                            break;
                        case "free wifi":
                            IconComponent = (
                                <Wifi className="w-5 h-5" />
                            );
                            break;
                        default:
                            IconComponent = (
                                <Check className="w-5 h-5" />
                            );
                    }
                    return (
                        <div
                            key={feature}
                            className="flex items-center space-x-3 max-w-50"
                        >
                            {IconComponent}
                            <span>{feature}</span>
                        </div>
                    );
                })
            }
        </div>
    )
}

export default FeaturesList
