import { parseISO, startOfDay } from 'date-fns'
import type { Prisoner } from 'prisonerApi'
import type { PrisonerSummary } from 'viewModels'
import toPrisonerSummary from './prisonerToPrisonerSummaryMapper'

describe('prisonerSummaryMapper', () => {
  it('should map to Prisoner Summary', () => {
    // Given
    const prisoner: Prisoner = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: '2025-12-31',
      firstName: 'JIMMY',
      lastName: 'LIGHTFINGERS',
      receptionDate: '1999-08-29',
      dateOfBirth: '1969-02-12',
      cellLocation: 'A-1-102',
      restrictedPatient: false,
    }
    const expected = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      dateOfBirth: startOfDay(parseISO('1969-02-12')),
      location: 'A-1-102',
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Prisoner Summary given prisoner has no release date, reception date, or DOB', () => {
    // Given
    const prisoner: Prisoner = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: '',
      firstName: 'JIMMY',
      lastName: 'LIGHTFINGERS',
      receptionDate: '',
      dateOfBirth: '',
      cellLocation: 'A-1-102',
      restrictedPatient: false,
      supportingPrisonId: undefined,
    }

    const expected: PrisonerSummary = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      dateOfBirth: null,
      location: 'A-1-102',
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Prisoner Summary given prisoner mixed case and spaces in names', () => {
    // Given
    const prisoner: Prisoner = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: '2025-12-31',
      firstName: ' Jimmy  ',
      lastName: '  LIGHTFinGerS ',
      receptionDate: '1999-08-29',
      dateOfBirth: '1969-02-12',
      cellLocation: 'A-1-102',
      restrictedPatient: true,
      supportingPrisonId: 'LEI',
    }

    const expected: PrisonerSummary = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      dateOfBirth: startOfDay(parseISO('1969-02-12')),
      location: 'A-1-102',
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })
})
