const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"))
const path = require('path')
const axios = require('axios')

class Email {
  constructor(axios) {
    this.axios = axios
    this.path = '/email'
  }  

  send(message) {
    return Promise.all([message._addInlines(), message._addAttachments()]).then(() => {
      this.axios.post(this.path, message.toJson()).then(response => {
        return EmailMessage.fromJson(response.data)
      }).catch(error => {
        const data = error.response.data
        throw new EmailError(data.code, data.message)
      })
    }).catch(error => {
      throw new EmailError(0, error.message)
    })
    // message._add_files(err => {
    //   if (err) {
    //     return callback(new EmailError(0, err.toString()))
    //   }

    //   // console.log(message)

    //   // this.axios.post(this.path, message.toJson())
    //   //   .then(response => {
    //   //     callback(null, EmailMessage.fromJson(response.data))
    //   //   })
    //   //   .catch(error => {
    //   //     const data = error.response.data
    //   //     callback(new EmailError(data.code, data.message))
    //   //   })
    // })
  }
}

class EmailMessage {
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
    return Promise.map(this.inlines, p => {
      return fs.readFileAsync(p, 'base64').then(content => {
        return {
          'name': path.basename(p),
          'content': content
        }
      })
    }).then((inlines) => {
      this._inlines = inlines
    })
  }

  _addAttachments() {
    return Promise.map(this.attachments, p => {
      return fs.readFileAsync(p, 'base64').then(content => {
        return {
          'name': path.basename(p),
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
    const em = new EmailMessage(message.to, message.from, message.subject)
    em.id = message.id
    em.time = message.time
    em.status = message.status
    return em
  }
}

class EmailError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, EmailError)
    this.name = this.constructor.name
  }
}

module.exports = {
  Email,
  EmailMessage,
  EmailError
}