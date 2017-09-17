const {Enum} = require('enumify')
const {sprintf} = require('sprintf-js')

class Log {
  constructor(axios) {
    this.axios = axios
    this.path = '/log'
    this.level = Level.INFO
    this.fields = {}

    // Automatically report uncaught fatal error
    process.on('uncaughtException', (error) => {
      this.fatal({
        message: error.message,
        stack_trace: error.stack
      })
    })

    // Automatically report unhandled rejection
    process.on('unhandledRejection', (reason, promise) => {
      this.fatal({
        message: 'unhandled rejection',
        promise,
        reason
      })
    })
  }

  debug(fields) {
    this._log(Level.DEBUG, fields)
  }

  info(fields) {
    this._log(Level.INFO, fields)
  }

  warn(fields) {
    this._log(Level.WARN, fields)
  }

  error(fields) {
    this._log(Level.ERROR, fields)
  }

  fatal(fields) {
    this._log(Level.FATAL, fields)
  }

  _write(entry) {
    return this.axios.post(this.path, entry)
      .catch(error => {
        const data = error.response.data
        throw new LogError(data.code, data.message)
      })
  }

  _log(level, fields) {
    if (level.ordinal < this.level.ordinal) {
      return
    }

    // Log fields
    fields.time = new Date().toISOString()
    fields.level = level.name
    Object.assign(fields, this.fields)

    // Write log
    this._write(fields)
      .catch(error => {
        console.error(sprintf('log error: message=%s', error.message))
      })
    }
}

class Level extends Enum {
}

Level.initEnum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']);

class LogError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, LogError)
    this.name = this.constructor.name;
  }
}

module.exports = {
  Log,
  Level,
  LogError
}