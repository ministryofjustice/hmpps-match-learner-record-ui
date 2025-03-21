import prisoners from './prisonerByIdData'

const prisonerList = [...Object.values(prisoners).map(prisoner => prisoner.response.jsonBody)]

export default prisonerList
