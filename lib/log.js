const {Enum} = require('enumify')
const {sprintf} = require('sprintf-js')

class Log {
  constructor(axios) {
    this.axios = axios
    this.path = '/log'
    this._timer = null
    this.entries = []
    this.level = Level.INFO
    this.fields = {}
    this.batchSize = 60
    this.dispatchInterval = 60

    // Automatically report uncaught fatal error
    process.on('uncaughtException', (error) => {
      this.fatal({
        'message': error.message,
        'stack_trace': error.stack
      })
    })

    // Automatically report unhandled rejection
    process.on('unhandledRejection', (reason, promise) => {
      this.fatal({
        'message': 'unhandled rejection',
        'promise': promise,
        'reason': reason
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

  _dispatch() {
    if (this.entries.length === 0) {
      return Promise.resolve()
    }

    return this.axios.post(this.path, JSON.stringify(this.entries))
      .catch(error => {
        const data = error.response.data
        throw new LogError(data.code, data.message)
      })
      .finally(() => {
        this.entries.length = 0
      })
  }

  _log(level, fields) {
    if (level.ordinal < this.level.ordinal) {
      return
    }

    if (!this._timer) {
      this._timer = setInterval(() => {
        this._dispatch().catch(error => {
          console.error(sprintf('log error: code=%d, message=%s', error.code, error.message))
        })
      }, this.dispatchInterval * 1000)
    }

    fields.time = new Date().toISOString()
	  fields.level = level.name
    Object.assign(fields, this.fields)
    this.entries.push(fields)

    if (level === Level.FATAL || this.entries.length >= this.batchSize) {
      this._dispatch().catch(error => {
        console.error(sprintf('log error: code=%d, message=%s', error.code, error.message))
      })
    }
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