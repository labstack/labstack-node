class Store {
  constructor(axios) {
    this.axios = axios
    this.path = '/store'
  }

  insert(key, value) {
    const entry = new StoreEntry(key, value)
    return this.axios.post(this.path, entry).then(response => {
      return StoreEntry.fromJson(response.data)
    }).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  get(key) {
    return this.axios.get(`${this.path}/${key}`).then(response => {
      return StoreEntry.fromJson(response.data)
    }).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  query(filters, limit, offset) {
    return this.axios.get(this.path, {
      params: {
        filters,
        limit,
        offset 
      }
    }).then(response => {
      return StoreQueryResponse.fromJson(response.data)
    }).catch(error => {
      const data = error.response
      throw new StoreError(data.code, data.message)
    })
  }

  update (key, value) {
    return this.axios.put(`${this.path}/${key}`, {
      key,
      value
    }).catch(error => {
      const data = error.response.data
      throw new StoreError(data.code, data.message)
    })
  }

  delete(key) {
    return this.axios.delete(`${this.path}/${key}`).catch(error => {
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