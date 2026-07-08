export interface SAIdInfo {
  dateOfBirth: Date;
  formattedDOB: string;
  gender: 'Male' | 'Female';
  citizenship: 'SA Citizen' | 'Permanent Resident';
  isValid: boolean;
}

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
  
  // Must be exactly 13 digits - NO Luhn validation, accept any 13 digits
  if (!/^\d{13}$/.test(cleanId)) {
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

