import { Listing } from '@/types/listing'
import { useTranslations } from 'next-intl'

const AboutListing = ({ property }: { property: Listing }) => {
    const t = useTranslations("translation")

    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-[12px]">{t("about")}</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-full first-letter:uppercase">
                <span>
                    {property.description || t("noDescriptionAvailable")}
                </span>
            </p>
        </div>
    )
}

export default AboutListing
