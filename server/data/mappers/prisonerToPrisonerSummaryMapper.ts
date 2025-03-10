import type { Prisoner } from 'prisonerApi'
import type { PrisonerSummary } from 'viewModels'
import { parseISO, startOfDay } from 'date-fns'

export default function toPrisonerSummary(prisoner: Prisoner): PrisonerSummary {
  return {
    prisonerNumber: prisoner.prisonerNumber,
    prisonId: prisoner.prisonId,
    firstName: capitalize(prisoner.firstName),
    lastName: capitalize(prisoner.lastName),
    dateOfBirth: prisoner.dateOfBirth ? startOfDay(parseISO(prisoner.dateOfBirth)) : null,
    location: prisoner.cellLocation,
  }
}

// Trim whitespace from a name string and capitalize the first letter and lowercase the rest of the string
const capitalize = (name: string): string => {
  const trimmedLowercaseName = name.trim().toLowerCase()
  return trimmedLowercaseName.charAt(0).toUpperCase() + trimmedLowercaseName.slice(1)
}
