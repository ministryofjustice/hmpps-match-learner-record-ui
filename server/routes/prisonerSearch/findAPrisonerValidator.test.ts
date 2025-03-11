import type { FindAPrisonerForm } from 'forms'
import validateFindAPrisonerForm from './findAPrisonerValidator'

describe('validateFindAPrisonerForm', () => {
  it('should return no errors for valid form', () => {
    const form: FindAPrisonerForm = {
      search: '1234567890',
    }

    const actualErrors = validateFindAPrisonerForm(form)

    expect(actualErrors).toEqual([])
  })

  it('should validate when missing name or number', () => {
    const form: FindAPrisonerForm = {
      search: '',
    }

    const expectedErrors = [{ href: '#search', text: 'Enter either a name or prison number' }]

    const actualErrors = validateFindAPrisonerForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })
})
