import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({ name: 'HMPPS Match Learner Record Ui', stream: formatOut, level: 'debug' })

export default logger
