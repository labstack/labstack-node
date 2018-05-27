const mqtt = require('mqtt')

class Hub {
  constructor(accountID, apiKey, clientID) {
    this.accountID = accountID
    this.apiKey = apiKey
    this.handlers = {}
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
      this.handlers[topic](message)
    })
    // this.client.on('end', () => {
    // })
  }

  publish(topic, message) {
    this.client.publish(`${this.accountID}/${topic}`, message)
  }

  subscribe(topic, handler) {
    topic = `${this.accountID}/${topic}`
    this.client.subscribe(topic)
    this.handlers[topic] = handler
  }

  unsubscribe(self, topic) {
    this.client.unsubscribe(`${this.accountID}/${topic}`)  
  }

  disconnect(self) {
    this.client.end()
  }
}

module.exports = Hub 