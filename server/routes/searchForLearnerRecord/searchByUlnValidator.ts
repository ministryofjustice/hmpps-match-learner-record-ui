import type { SearchByUlnForm } from 'forms'

export default function validateSearchByUlnForm(searchByUlnForm: SearchByUlnForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  if (!searchByUlnForm.uln) {
    errors.push({ href: `#uln`, text: 'Enter a ULN' })
  }

  return errors
}
