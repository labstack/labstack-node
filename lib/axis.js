const got = require('got')
const mqtt = require('mqtt')

class Axis {
  constructor(apiKey, clientID, options) {
    this.apiKey = apiKey
    this.clientID = clientID
    this.handlers = {}
    this.options = options || {}
  }

  _normalizeDeviceID() {
    return `${this.projectID}:${this.clientID}`
  }

  _normalizeTopic(topic) {
    return `${this.projectID}/${topic}`
  }

  _denormalizeTopic(topic) {
    return topic.replace(this.projectID + '/', '');
  }

  async _findProjectID() {
    try {
      const response = await got('https://api.labstack.com/axis/key', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        json: true
      });
      this.projectID = response.body.project_id
    } catch (error) {
      throw 'Unable to find the project'
    }
  }

  async connect(handler) {
    try {
      await this._findProjectID()
    } catch (error) {
      throw error
    }

    this.client = mqtt.connect('mqtt://axis.labstack.com', {
      username: this.projectID,
      password: this.apiKey,
      clientId: this._normalizeDeviceID()
    })
    this.client.on('connect', () => {
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

module.exports = Axis