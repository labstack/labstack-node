const {Enum} = require('enumify')
const {sprintf} = require('sprintf-js')

class Log {
  constructor(axios) {
    this.axios = axios
    this.path = '/log'
    this._timer = null
    this.entries = []
    this.appId = ''
    this.appName = '' 
    this.tags = []
    this.level = Level.INFO
    this.batchSize = 60
    this.dispatchInterval = 60
  }

  debug(format, ...args) {
    this._log(Level.DEBUG, format, args)
  }

  info(format, ...args) {
    this._log(Level.INFO, format, args)
  }

  warn(format, ...args) {
    this._log(Level.WARN, format, args)
  }

  error(format, ...args) {
    this._log(Level.ERROR, format, args)
  }

  fatal(format, ...args) {
    this._log(Level.FATAL, format, args)
  }

  _dispatch() {
    if (this.entries.length === 0) {
      return
    }

    return this.axios.post(this.path, JSON.stringify(this.entries))
      .catch(error => {
        const data = error.response.data
        throw new StoreError(data.code, data.message)
      })
      .finally(() => {
        this.entries.length = 0
      })
  }

  _log(level, format, args) {
    if (level < this.level) {
      return
    }

    if (!this._timer) {
      this._timer = setInterval(() => {
        this._dispatch().catch(LogError, error => {
          console.error(sprintf('log error: code=%d, message=%s', error.code, error.message))
        })
      }, this.dispatchInterval * 1000)
    }

    const message = sprintf(format, args)
    this.entries.push({
      'time': new Date().toISOString(),
		  'app_id': this.appId,
		  'app_name': this.appName,
		  'tags': this.tags,
		  'level': level.name,
		  'message': message,
    })

    if (this.entries.length >= this.batchSize) {
      this._dispatch().catch(LogError, error => {
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