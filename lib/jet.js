const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"))
const path = require('path')
const axios = require('axios')

class Jet {
  constructor(axios) {
    this.axios = axios
    this.path = '/jet'
  }  

  send(message) {
    return Promise.all([message._addInlines(), message._addAttachments()]).then(() => {
      this.axios.post(`${this.path}/send`, message.toJson()).then(response => {
        return JetMessage.fromJson(response.data)
      }).catch(error => {
        const data = error.response.data
        throw new JetError(data.code, data.message)
      })
    }).catch(error => {
      throw new JetError(0, error.message)
    })
  }
}

class JetMessage {
  constructor(to, from, subject) {
    this._inlines = []
    this._attachments = []
    this.to = to
    this.from = from 
    this.subject = subject
    this.body = ''
    this.inlines = []
    this.attachments = []
    this.status = ''
  }

  _addInlines() {
    return Promise.map(this.inlines, inline => {
      return fs.readFileAsync(inline, 'base64').then(content => {
        return {
          'name': path.basename(inline),
          'content': content
        }
      })
    }).then((inlines) => {
      this._inlines = inlines
    })
  }

  _addAttachments() {
    return Promise.map(this.attachments, attachment => {
      return fs.readFileAsync(attachment, 'base64').then(content => {
        return {
          'name': path.basename(attachment),
          'content': content
        }
      })
    }).then((attachments) => {
      this._attachments = attachments
    })
  }

  addInline(path) {
    this.inlines.push(path)
  }

  addAttachment(path) {
    this.attachments.push(path)
  }

  toJson() {
    return JSON.stringify({
      to: this.to,
      from: this.from,
      subject: this.subject,
      body: this.body,
      inlines: this._inlines,
      attachments: this._attachments
    })  
  }

  static fromJson(message) {
    const em = new JetMessage(message.to, message.from, message.subject)
    em.id = message.id
    em.time = message.time
    em.status = message.status
    return em
  }
}

class JetError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, JetError)
    this.name = this.constructor.name
  }
}

module.exports = {
  Jet,
  JetMessage,
  JetError
}