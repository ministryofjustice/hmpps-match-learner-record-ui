import type { SearchByInformationForm } from 'forms'
import validateSearchByInformationForm from './searchByInformationValidator'

let standardForm: SearchByInformationForm

describe('validateSearchByInformationForm', () => {
  beforeEach(() => {
    standardForm = {
      givenName: 'John',
      familyName: 'Doe',
      'dob-day': '01',
      'dob-month': '01',
      'dob-year': '1950',
      postcode: 'ZZ99 9ZZ',
      sex: 'NOT_KNOWN',
    }
  })

  it('should return no errors for valid form', () => {
    const form = standardForm

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual([])
  })

  it('should validate when missing given name', () => {
    const form = standardForm
    form.givenName = ''

    const expectedErrors = [{ href: '#givenName', text: 'Enter a given name' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when missing family name', () => {
    const form = standardForm
    form.familyName = ''

    const expectedErrors = [{ href: '#familyName', text: 'Enter a family name' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when missing dob day', () => {
    const form = standardForm
    form['dob-day'] = ''

    const expectedErrors = [{ href: '#dob', text: 'Enter a date of birth' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when missing dob month', () => {
    const form = standardForm
    form['dob-month'] = ''

    const expectedErrors = [{ href: '#dob', text: 'Enter a date of birth' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when missing dob year', () => {
    const form = standardForm
    form['dob-year'] = ''

    const expectedErrors = [{ href: '#dob', text: 'Enter a date of birth' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when missing full dob', () => {
    const form = standardForm
    form['dob-day'] = ''
    form['dob-month'] = ''
    form['dob-year'] = ''

    const expectedErrors = [{ href: '#dob', text: 'Enter a date of birth' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate multiple missing fields', () => {
    const form: SearchByInformationForm = {
      givenName: '',
      familyName: '',
      'dob-day': '',
      'dob-month': '',
      'dob-year': '',
      postcode: '',
      sex: '',
    }

    const expectedErrors = [
      { href: '#givenName', text: 'Enter a given name' },
      { href: '#familyName', text: 'Enter a family name' },
      { href: '#dob', text: 'Enter a date of birth' },
    ]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })

  it('should validate when year is not four digits', () => {
    const form = standardForm
    form['dob-year'] = '58'

    const expectedErrors = [{ href: '#dob', text: 'Year must include 4 numbers' }]

    const actualErrors = validateSearchByInformationForm(form)

    expect(actualErrors).toEqual(expectedErrors)
  })
})
