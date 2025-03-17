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

  it('should validate when missing uln', () => {
    const form: SearchByUlnForm = {
      uln: '',
    }

    const expectedErrors = [{ href: '#uln', text: 'Enter a ULN' }]

    const actualErrors = validateSearchByUlnForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when uln is not formatted correctly', () => {
    const form: SearchByUlnForm = {
      uln: 'AB3456789GGh9',
    }

    const expectedErrors = [{ href: '#uln', text: 'ULN must be exactly 10 digits and contain only numbers' }]

    const actualErrors = validateSearchByUlnForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })
})
