const http = require('http')
const enc = require('encoding')
const app = require('express')()

const baseurl = 'http://home.agh.edu.pl/~maziarz/LabPE'

const convert_url = url => new Promise(resolve => http.get(url, res => {
  let data = []
  res.on('data', chunk => data.push(chunk))
  res.on('end', () => {
    data = Buffer.concat(data)
    const [, charser] = data.toString().match(/charset=([^"]*)/) || [, 'utf8']
    data = enc.convert(data, 'utf8', charser).toString()
      .replace(/src="([^"]*)"/gi, (_, src) => `src="${baseurl}/${src}"`)
    resolve(data)
  })
}))

app.get('*', async (req, res) => res.send(await convert_url(`${baseurl}/${req.url}`)))

app.listen(process.env.PORT || 3000)