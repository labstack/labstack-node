class Store {
  constructor(axios) {
    this.axios = axios
    this.path = '/store'
  }

  insert(collection, document) {
    return this.axios.post(`${this.path}/${collection}`, document).then(response => {
      return response.data
    }).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  get(collection, id) {
    return this.axios.get(`${this.path}/${collection}/${id}`).then(response => {
      return response.data
    }).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  search(collection, params) {
    return this.axios.post(`${this.path}/${collection}/search`, params).then(response => {
      return response.data
    }).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  update (collection, id, document) {
    return this.axios.patch(`${this.path}/${collection}/${id}`, document).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  delete(collection, id) {
    return this.axios.delete(`${this.path}/${collection}/${id}`).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }
}

class StoreError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, StoreError)
    this.name = this.constructor.name;
  }
}

class StoreEntry {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.createdAt = null
    this.updatedAt = null 
  }

  toJson() {
    return JSON.stringify({
      key: this.key,
      value: this.value
    })
  }

  static fromJson(entry) {
    const se = new StoreEntry(entry.key, entry.value)
    se.createdAt = entry.created_at
    se.updatedAt = entry.updated_at
    return se
  }
}

class StoreQueryResponse {
  constructor() {
    this.total = 0,
    this.entries = [] 
  }

  static fromJson(response) {
    const qr = new StoreQueryResponse()
    qr.total = response.total
    qr.entries = response.entries.map(entry => {
      return StoreEntry.fromJson(entry)
    })
    return qr
  }
}

module.exports = {
  Store,
  StoreError
}