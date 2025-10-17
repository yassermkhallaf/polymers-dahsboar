import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { set } from "date-fns";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function excelSerialToDate(serial) {
  const excelEpoch = new Date(Date.UTC(1900, 0, 0));
  const result = new Date(excelEpoch.getTime() + serial * 86400000);
  return set(result, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
}
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export function getCountryCode(countryName) {
  if (!countryName) return null;
  const code = countries.getAlpha2Code(countryName, "en");
  return code || null; // returns "EG" for "Egypt"
}
