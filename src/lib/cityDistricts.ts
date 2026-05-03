/**
 * Shared Turkish city/district (il/ilçe) data.
 * Single source of truth used by SearchPage, ListingsManagement,
 * SettingsPage, CSV import validation, and reports.
 */

export interface CityEntry {
  value: string;   // lowercase key used in API filters
  label: string;   // display label in Turkish
  districts: string[];
}

export const CITIES: CityEntry[] = [
  {
    value: "mugla",
    label: "Muğla",
    districts: ["Bodrum", "Marmaris", "Fethiye", "Datça", "Milas", "Köyceğiz", "Ortaca", "Ula"],
  },
  {
    value: "istanbul",
    label: "İstanbul",
    districts: ["Kadıköy", "Beşiktaş", "Sarıyer", "Şişli", "Maltepe", "Ataşehir", "Üsküdar", "Bakırköy", "Beylikdüzü", "Çekmeköy", "Fatih", "Bahçelievler"],
  },
  {
    value: "ankara",
    label: "Ankara",
    districts: ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Polatlı", "Gölbaşı"],
  },
  {
    value: "izmir",
    label: "İzmir",
    districts: ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli", "Bayraklı", "Balçova", "Gaziemir", "Narlıdere", "Urla", "Çeşme"],
  },
  {
    value: "antalya",
    label: "Antalya",
    districts: ["Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat", "Serik", "Döşemealtı", "Aksu", "Gazipaşa"],
  },
  {
    value: "bursa",
    label: "Bursa",
    districts: ["Osmangazi", "Nilüfer", "Yıldırım", "Mudanya", "Gemlik", "İnegöl", "Karacabey"],
  },
  {
    value: "konya",
    label: "Konya",
    districts: ["Selçuklu", "Meram", "Karatay", "Ereğli", "Akşehir", "Ilgın"],
  },
  {
    value: "adana",
    label: "Adana",
    districts: ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan", "Kozan"],
  },
  {
    value: "kocaeli",
    label: "Kocaeli",
    districts: ["İzmit", "Gebze", "Darıca", "Karamürsel", "Gölcük", "Körfez"],
  },
];

/** Map: city value → district list */
export const CITY_DISTRICTS: Record<string, string[]> = Object.fromEntries(
  CITIES.map((c) => [c.value, c.districts])
);

/** Map: city value → display label */
export const CITY_LABELS: Record<string, string> = Object.fromEntries(
  CITIES.map((c) => [c.value, c.label])
);

/**
 * Returns districts for a city value, or [] if city is unknown.
 */
export function getDistricts(cityValue: string): string[] {
  return CITY_DISTRICTS[cityValue] ?? [];
}

/**
 * Returns true if the district belongs to the given city.
 */
export function isValidDistrict(cityValue: string, district: string): boolean {
  const districts = getDistricts(cityValue);
  return districts.some((d) => d.toLowerCase() === district.toLowerCase());
}
