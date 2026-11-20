// Country dial codes with expected national-number lengths (lenient ranges).
// Flag emojis are derived from the ISO code — no image assets needed.

export const COUNTRIES = [
  { name: 'Afghanistan', iso: 'AF', dial: '93', min: 9, max: 9 },
  { name: 'Albania', iso: 'AL', dial: '355', min: 8, max: 9 },
  { name: 'Algeria', iso: 'DZ', dial: '213', min: 8, max: 9 },
  { name: 'Argentina', iso: 'AR', dial: '54', min: 10, max: 11 },
  { name: 'Armenia', iso: 'AM', dial: '374', min: 8, max: 8 },
  { name: 'Australia', iso: 'AU', dial: '61', min: 9, max: 9 },
  { name: 'Austria', iso: 'AT', dial: '43', min: 10, max: 11 },
  { name: 'Azerbaijan', iso: 'AZ', dial: '994', min: 9, max: 9 },
  { name: 'Bahrain', iso: 'BH', dial: '973', min: 8, max: 8 },
  { name: 'Bangladesh', iso: 'BD', dial: '880', min: 10, max: 10 },
  { name: 'Belgium', iso: 'BE', dial: '32', min: 8, max: 9 },
  { name: 'Brazil', iso: 'BR', dial: '55', min: 10, max: 11 },
  { name: 'Bulgaria', iso: 'BG', dial: '359', min: 8, max: 9 },
  { name: 'Cameroon', iso: 'CM', dial: '237', min: 8, max: 9 },
  { name: 'Canada', iso: 'CA', dial: '1', min: 10, max: 10 },
  { name: 'China', iso: 'CN', dial: '86', min: 11, max: 11 },
  { name: 'Colombia', iso: 'CO', dial: '57', min: 10, max: 10 },
  { name: 'Croatia', iso: 'HR', dial: '385', min: 8, max: 9 },
  { name: 'Cyprus', iso: 'CY', dial: '357', min: 8, max: 8 },
  { name: 'Czechia', iso: 'CZ', dial: '420', min: 9, max: 9 },
  { name: 'Denmark', iso: 'DK', dial: '45', min: 8, max: 8 },
  { name: 'Egypt', iso: 'EG', dial: '20', min: 10, max: 10 },
  { name: 'Estonia', iso: 'EE', dial: '372', min: 7, max: 8 },
  { name: 'Ethiopia', iso: 'ET', dial: '251', min: 9, max: 9 },
  { name: 'Finland', iso: 'FI', dial: '358', min: 8, max: 10 },
  { name: 'France', iso: 'FR', dial: '33', min: 9, max: 9 },
  { name: 'Germany', iso: 'DE', dial: '49', min: 10, max: 11 },
  { name: 'Ghana', iso: 'GH', dial: '233', min: 9, max: 9 },
  { name: 'Greece', iso: 'GR', dial: '30', min: 10, max: 10 },
  { name: 'India', iso: 'IN', dial: '91', min: 10, max: 10 },
  { name: 'Indonesia', iso: 'ID', dial: '62', min: 9, max: 12 },
  { name: 'Iran', iso: 'IR', dial: '98', min: 10, max: 10 },
  { name: 'Iraq', iso: 'IQ', dial: '964', min: 10, max: 10 },
  { name: 'Ireland', iso: 'IE', dial: '353', min: 9, max: 9 },
  { name: 'Israel', iso: 'IL', dial: '972', min: 9, max: 9 },
  { name: 'Italy', iso: 'IT', dial: '39', min: 9, max: 11 },
  { name: 'Japan', iso: 'JP', dial: '81', min: 10, max: 10 },
  { name: 'Kenya', iso: 'KE', dial: '254', min: 9, max: 9 },
  { name: 'Kuwait', iso: 'KW', dial: '965', min: 8, max: 8 },
  { name: 'Malaysia', iso: 'MY', dial: '60', min: 9, max: 10 },
  { name: 'Mexico', iso: 'MX', dial: '52', min: 10, max: 10 },
  { name: 'Netherlands', iso: 'NL', dial: '31', min: 9, max: 9 },
  { name: 'New Zealand', iso: 'NZ', dial: '64', min: 8, max: 10 },
  { name: 'Nigeria', iso: 'NG', dial: '234', min: 7, max: 10 },
  { name: 'Norway', iso: 'NO', dial: '47', min: 8, max: 8 },
  { name: 'Pakistan', iso: 'PK', dial: '92', min: 10, max: 10 },
  { name: 'Philippines', iso: 'PH', dial: '63', min: 10, max: 10 },
  { name: 'Poland', iso: 'PL', dial: '48', min: 9, max: 9 },
  { name: 'Portugal', iso: 'PT', dial: '351', min: 9, max: 9 },
  { name: 'Qatar', iso: 'QA', dial: '974', min: 8, max: 8 },
  { name: 'Romania', iso: 'RO', dial: '40', min: 9, max: 9 },
  { name: 'Russia', iso: 'RU', dial: '7', min: 10, max: 10 },
  { name: 'Saudi Arabia', iso: 'SA', dial: '966', min: 9, max: 9 },
  { name: 'Singapore', iso: 'SG', dial: '65', min: 8, max: 8 },
  { name: 'South Africa', iso: 'ZA', dial: '27', min: 9, max: 9 },
  { name: 'South Korea', iso: 'KR', dial: '82', min: 9, max: 10 },
  { name: 'Spain', iso: 'ES', dial: '34', min: 9, max: 9 },
  { name: 'Sweden', iso: 'SE', dial: '46', min: 9, max: 9 },
  { name: 'Switzerland', iso: 'CH', dial: '41', min: 9, max: 9 },
  { name: 'Tanzania', iso: 'TZ', dial: '255', min: 9, max: 9 },
  { name: 'Turkey', iso: 'TR', dial: '90', min: 10, max: 10 },
  { name: 'UAE', iso: 'AE', dial: '971', min: 9, max: 9 },
  { name: 'Uganda', iso: 'UG', dial: '256', min: 9, max: 9 },
  { name: 'Ukraine', iso: 'UA', dial: '380', min: 9, max: 9 },
  { name: 'United Kingdom', iso: 'GB', dial: '44', min: 10, max: 10 },
  { name: 'United States', iso: 'US', dial: '1', min: 10, max: 10 },
  { name: 'Vietnam', iso: 'VN', dial: '84', min: 9, max: 10 },
  { name: 'Zimbabwe', iso: 'ZW', dial: '263', min: 9, max: 9 },
  { name: 'Other country', iso: 'XX', dial: '', min: 8, max: 15 },
];

export function flagEmoji(iso) {
  if (!iso || iso.length !== 2) return '🌍';
  return String.fromCodePoint(...iso.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)));
}

// Validates a phone number against the selected country.
// Returns { ok, national, full, error } — full is the E.164-style number.
export function validatePhone(country, raw) {
  const digits = String(raw || '').replace(/[^\d+]/g, '');
  if (!digits) return { ok: false, error: 'Phone number is required' };

  if (!country.dial) {
    // "Other country": user types the full international number, e.g. +46…
    if (!/^\+\d{8,15}$/.test(digits)) {
      return { ok: false, error: 'Enter the full international number starting with + (e.g. +46 70 123 45 67)' };
    }
    return { ok: true, national: digits, full: digits };
  }

  let national = digits.replace(/^\+/, '');
  if (national.startsWith(country.dial)) national = national.slice(country.dial.length);
  if (national.startsWith('0')) national = national.slice(1); // trunk prefix
  const min = country.min || 6;
  const max = country.max || 14;
  if (!/^\d+$/.test(national) || national.length < min || national.length > max) {
    return {
      ok: false,
      error: `Enter a valid ${country.name} number — ${min}–${max} digits after +${country.dial}`,
    };
  }
  return { ok: true, national, full: `+${country.dial}${national}` };
}

export function whatsappLink(number) {
  const digits = String(number || '').replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}
