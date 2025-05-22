import { nanoid } from 'nanoid';

/**
 * Generates a unique study ID with a standardized format
 * Format: STU-YYYY-XXXXX-P
 * STU: Study prefix
 * YYYY: Year
 * XXXXX: 5-character unique identifier
 * P: Phase number (1-4) or 'N' for Not Applicable
 * @param {string} phase - Study phase (PHASE_1, PHASE_2, PHASE_3, PHASE_4, NOT_APPLICABLE)
 * @returns {string} Generated study ID
 */
export const generateStudyId = (phase) => {
  const prefix = 'STU';
  const year = new Date().getFullYear();
  const uniqueId = nanoid(5).toUpperCase();
  const phaseMap = {
    PHASE_1: '1',
    PHASE_2: '2',
    PHASE_3: '3',
    PHASE_4: '4',
    NOT_APPLICABLE: 'N'
  };
  const phaseSuffix = phaseMap[phase] || 'N';

  return `${prefix}-${year}-${uniqueId}-${phaseSuffix}`;
};

/**
 * Validates if a study ID follows the correct format
 * @param {string} studyId - Study ID to validate
 * @returns {boolean} Whether the ID is valid
 */
export const isValidStudyId = (studyId) => {
  const pattern = /^STU-\d{4}-[A-Z0-9]{5}-[1-4N]$/;
  return pattern.test(studyId);
};

/**
 * Extracts information from a study ID
 * @param {string} studyId - Study ID to parse
 * @returns {Object} Parsed information or null if invalid
 */
export const parseStudyId = (studyId) => {
  if (!isValidStudyId(studyId)) return null;

  const [prefix, year, uniqueId, phase] = studyId.split('-');
  const phaseMap = {
    '1': 'PHASE_1',
    '2': 'PHASE_2',
    '3': 'PHASE_3',
    '4': 'PHASE_4',
    'N': 'NOT_APPLICABLE'
  };

  return {
    prefix,
    year: parseInt(year),
    uniqueId,
    phase: phaseMap[phase]
  };
}; 