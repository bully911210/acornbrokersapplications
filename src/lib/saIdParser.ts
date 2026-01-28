export interface SAIdInfo {
  dateOfBirth: Date;
  formattedDOB: string;
  gender: 'Male' | 'Female';
  citizenship: 'SA Citizen' | 'Permanent Resident';
  isValid: boolean;
}

/**
 * Validates SA ID using Luhn algorithm
 */
const luhnCheck = (idNumber: string): boolean => {
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(idNumber[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

/**
 * Parses a South African ID number and extracts personal information
 * SA ID format: YYMMDD SSSS C A Z
 * - YYMMDD: Date of birth
 * - SSSS: Gender (0000-4999 = Female, 5000-9999 = Male)
 * - C: Citizenship (0 = SA Citizen, 1 = Permanent Resident)
 * - A: Usually 8 (was used for race, now obsolete)
 * - Z: Checksum digit
 */
export function parseSAId(idNumber: string): SAIdInfo | null {
  // Remove any spaces
  const cleanId = idNumber.replace(/\s/g, '');
  
  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(cleanId)) {
    return null;
  }

  // Validate with Luhn check
  if (!luhnCheck(cleanId)) {
    return null;
  }

  // Extract date of birth
  const year = parseInt(cleanId.substring(0, 2), 10);
  const month = parseInt(cleanId.substring(2, 4), 10);
  const day = parseInt(cleanId.substring(4, 6), 10);

  // Determine century (assume 2000s for 00-25, 1900s for 26-99)
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year <= currentYear ? 2000 + year : 1900 + year;

  // Validate date
  const dateOfBirth = new Date(fullYear, month - 1, day);
  if (
    dateOfBirth.getFullYear() !== fullYear ||
    dateOfBirth.getMonth() !== month - 1 ||
    dateOfBirth.getDate() !== day
  ) {
    return null;
  }

  // Extract gender (digits 7-10)
  const genderDigits = parseInt(cleanId.substring(6, 10), 10);
  const gender: 'Male' | 'Female' = genderDigits >= 5000 ? 'Male' : 'Female';

  // Extract citizenship (digit 11)
  const citizenshipDigit = parseInt(cleanId.substring(10, 11), 10);
  const citizenship: 'SA Citizen' | 'Permanent Resident' = 
    citizenshipDigit === 0 ? 'SA Citizen' : 'Permanent Resident';

  return {
    dateOfBirth,
    formattedDOB: formatDateOfBirth(dateOfBirth),
    gender,
    citizenship,
    isValid: true,
  };
}

/**
 * Formats a date as "24 May 1990"
 */
export function formatDateOfBirth(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Formats SA ID with visual chunking: 910210 5009 08 7
 */
export function formatSAId(idNumber: string): string {
  const clean = idNumber.replace(/\D/g, '');
  let formatted = '';
  
  // 6-4-2-1 pattern
  if (clean.length > 0) formatted += clean.substring(0, 6);
  if (clean.length > 6) formatted += ' ' + clean.substring(6, 10);
  if (clean.length > 10) formatted += ' ' + clean.substring(10, 12);
  if (clean.length > 12) formatted += ' ' + clean.substring(12, 13);
  
  return formatted;
}

/**
 * Formats mobile number: 082 123 4567
 */
export function formatMobile(mobile: string): string {
  const clean = mobile.replace(/\D/g, '');
  let formatted = '';
  
  if (clean.length > 0) formatted += clean.substring(0, 3);
  if (clean.length > 3) formatted += ' ' + clean.substring(3, 6);
  if (clean.length > 6) formatted += ' ' + clean.substring(6, 10);
  
  return formatted;
}

/**
 * Formats account number in groups of 4: 1234 5678 90
 */
export function formatAccountNumber(accountNumber: string): string {
  const clean = accountNumber.replace(/\D/g, '');
  const groups = clean.match(/.{1,4}/g) || [];
  return groups.join(' ');
}
