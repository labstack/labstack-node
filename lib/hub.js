const mqtt = require('mqtt')

class Hub {
  constructor(accountID, apiKey, options) {
    this.accountID = accountID
    this.apiKey = apiKey
    this.handlers = {}
    this.options = options || {}
  }

  _normalizeTopic(topic) {
    return `${this.accountID}/${topic}`
  }

  _denormalizeTopic(topic) {
    return topic.replace(this.accountID + '/', '');
  }

  connect(handler) {
    this.client = mqtt.connect('mqtt://hub.labstack.com', {
      username: this.accountID,
      password: this.apiKey
    })
    this.client.on('connect', function () {
      if (handler) {
        handler()
      }
    })
    this.client.on('message', (topic, message) => {
      topic = this._denormalizeTopic(topic)
      handler = this.handlers[topic]
      if (this.options.messageHandler) {
        this.options.messageHandler(topic, message)
      }
      if (handler) {
        handler(topic, message)
      }
    })
    // this.client.on('end', () => {
    // })
  }

  publish(topic, message) {
    this.client.publish(this._normalizeTopic(topic), message)
  }

  subscribe(topic, handler) {
    this.client.subscribe(this._normalizeTopic(topic))
    this.handlers[topic] = handler
  }

  unsubscribe(self, topic) {
    this.client.unsubscribe(this._normalizeTopic(topic))  
  }

  disconnect(self) {
    this.client.end()
  }
}

module.exports = Hub 