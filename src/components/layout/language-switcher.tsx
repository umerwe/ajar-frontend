"use client";

import {Globe2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useSearchParams} from "next/navigation";

import {localeLabels, locales} from "@/i18n/routing";
import {usePathname, useRouter} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Locale = (typeof locales)[number];

export default function LanguageSwitcher() {
  const t = useTranslations("translation");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;

    const query = searchParams.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      locale: nextLocale as Locale,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="bg-white text-aqua hover:text-aqua"
          aria-label={t("changeLanguage")}
        >
          <Globe2 className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
          {locales.map((item) => (
            <DropdownMenuRadioItem key={item} value={item}>
              <span className="font-medium uppercase">{item}</span>
              <span className="text-xs text-gray-500">{localeLabels[item]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
