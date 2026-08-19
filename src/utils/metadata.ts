import type { Metadata } from "next";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

type MetadataKey = keyof typeof en.translation;

const messages = {
  ar: ar.translation,
  en: en.translation,
};

export function getLocalizedMetadata(locale: string, titleKey: MetadataKey): Metadata {
  const translation = locale === "ar" ? messages.ar : messages.en;
  const title = translation[titleKey] || messages.en[titleKey];

  return {
    title: `${title} | AJAR`,
    description: translation.ajarPageDescription,
  };
}
