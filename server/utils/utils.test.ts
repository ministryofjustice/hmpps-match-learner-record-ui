import { convertToTitleCase, getYear, initialiseName } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('convert to 4-character year', () => {
  it.each([
    ['1954', '1954'],
    ['2012', '2012'],
    ['76', '1976'],
    ['14', '2014'],
    ['3', '2003'],
  ])('getYear(%s) = %s', (value: string, expected: string) => {
    expect(getYear(value)).toEqual(expected)
  })
})

describe('throws an error', () => {
  it.each([['123'], ['345'], ['021']])('getYear(%s) throws an error', (value: string) => {
    try {
      getYear(value)
      fail()
    } catch (e) {
      expect(e.message).toContain('Invalid')
    }
  })
})
