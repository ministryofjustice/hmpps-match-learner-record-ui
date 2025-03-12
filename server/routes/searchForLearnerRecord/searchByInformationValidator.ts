import type { SearchByInformationForm } from 'forms'

export default function validateSearchByInformationForm(
  searchByInformationForm: SearchByInformationForm,
): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  if (!searchByInformationForm.givenName) {
    errors.push({ href: `#givenName`, text: 'Enter a given name' })
  }

  if (!searchByInformationForm.familyName) {
    errors.push({ href: `#familyName`, text: 'Enter a family name' })
  }

  const day = searchByInformationForm['dob-day']
  const month = searchByInformationForm['dob-month']
  const year = searchByInformationForm['dob-year']

  if (!day || !month || !year) {
    errors.push({ href: `#dob`, text: 'Enter a date of birth' })
  } else if (year.length < 4) {
    errors.push({ href: `#dob`, text: 'Enter four digits for the year' })
  }

  return errors
}
