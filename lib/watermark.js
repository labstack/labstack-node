class Watermark {
  constructor(client) {
    this.client = client
  }

  image(file, text, options) {
    const body = new FormData()
    body.append('file', fs.createReadStream(file))
    body.append('text', text)
    body.append('font', options.font)
    body.append('size', options.size)
    body.append('color', options.color)
    body.append('opacity', options.opacity)
    body.append('position', options.position)
    body.append('margin', options.margin)
    return this.client._request('POST', '/watermark/image', null, body, false)
  }
}

module.exports = Watermark