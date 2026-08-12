import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeaturesProps {
  freeCancellation?: boolean;
  noPrepayment?: boolean;
  layout?: "list" | "inline";
}

const Features = ({ freeCancellation, noPrepayment, layout = "list" }: FeaturesProps) => {
  const t = useTranslations("translation");

  if (!freeCancellation && !noPrepayment) return null;

  const features = [
    freeCancellation && { labelList: t("freeCancellation"), labelInline: t("fullyRefundable") },
    noPrepayment && { labelList: t("noPrepaymentNeeded"), labelInline: t("reserveNowPayLater") },
  ].filter(Boolean) as { labelList: string; labelInline: string }[];

  if (layout === "list") {
    return (
      <ul className="sm:space-y-1 mb-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-1 text-[#0E8800]">
            <Check className="h-3 w-3 sm:h-3 sm:w-4 shrink-0 mt-1" />
            <span className="text-xs min-[500px]:text-sm leading-5 max-[600px]:truncate">{feature.labelList}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <span className="flex max-[367px]:flex-col sm:flex-row gap-2">
      {features.map((feature, index) => (
        <span key={index} className="flex items-center gap-1 text-[#0E8800]">
          <Check className="h-4 w-4 " />
          <span>{feature.labelInline}</span>
        </span>
      ))}
    </span>
  );
};

export default Features;
