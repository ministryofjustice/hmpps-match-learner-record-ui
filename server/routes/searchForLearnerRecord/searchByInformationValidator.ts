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

  if (
    !searchByInformationForm['dob-day'] ||
    !searchByInformationForm['dob-month'] ||
    !searchByInformationForm['dob-year']
  ) {
    errors.push({ href: `#dob`, text: 'Enter a date of birth' })
  }

  return errors
}
