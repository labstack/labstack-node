class Watermark {
  constructor(client) {
    this.client = client
  }

  image(request) {
    const body = new FormData()
    body.append('file', fs.createReadStream(request.file))
    body.append('text', request.text)
    body.append('font', request.font)
    body.append('size', request.size)
    body.append('color', request.color)
    body.append('opacity', request.opacity)
    body.append('position', request.position)
    body.append('margin', request.margin)
    return this.client._request('POST', '/watermark/image', null, body, false)
  }
}

module.exports = Watermark