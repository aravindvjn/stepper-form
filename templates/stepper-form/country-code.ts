import { countries } from "country-data";

export const COUNTRY_CODES = countries.all
  .filter((country) => country.countryCallingCodes.length > 0)
  .map((country) => ({
    name: country.name,
    code: country.alpha2,
    dialCode: country.countryCallingCodes[0],
    flag: country.alpha2,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
