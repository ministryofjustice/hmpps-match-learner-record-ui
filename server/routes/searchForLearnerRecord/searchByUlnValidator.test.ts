import type { SearchByUlnForm } from 'forms'
import validateSearchByUlnForm from './searchByUlnValidator'

describe('validateSearchByUlnForm', () => {
  it('should return no errors for valid form', () => {
    const form: SearchByUlnForm = {
      uln: '1234567890',
    }

    const actualErrors = validateSearchByUlnForm(form)

    expect(actualErrors).toEqual([])
  })

  it('should validate when missing given name', () => {
    const form: SearchByUlnForm = {
      uln: '',
    }

    const expectedErrors = [{ href: '#uln', text: 'Enter a ULN' }]

    const actualErrors = validateSearchByUlnForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })
})
