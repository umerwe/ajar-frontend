import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;

export const localeLabels: Record<(typeof locales)[number], string> = {
  en: 'English',
  ar: 'Arabic',
};
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale: 'en'
});
