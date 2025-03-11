import type { FindAPrisonerForm } from 'forms'

export default function validateFindAPrisonerForm(findAPrisonerForm: FindAPrisonerForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  if (!findAPrisonerForm.search) {
    errors.push({ href: `#search`, text: 'Enter either a name or prison number' })
  }

  return errors
}
