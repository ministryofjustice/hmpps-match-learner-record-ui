const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

/**
 * Formats an ISO8601 datetime string into the format specified by the GOV.UK Style guide
 * e.g. 1 January 2022
 * https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#dates
 * @param dateAsISO A datetime string e.g. 2011-10-05T14:48:00.000Z or 2001-06-03
 * @returns A string
 * */
export function govukFormattedFullDateString(dateAsISO?: string): string {
  if (Number.isNaN(Date.parse(dateAsISO))) {
    return ''
  }

  const date = new Date(dateAsISO)

  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
