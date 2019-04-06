const http = require('http')
const enc = require('encoding')
const app = require('express')()

const baseurl = 'http://home.agh.edu.pl/~maziarz/LabPE'

const convert_url = url => new Promise(resolve => http.get(url, res => {
  const data = []
  res.on('data', chunk => data.push(chunk))
  res.on('end', () => {
    const data_buffer = Buffer.concat(data)
    const [, charser] = `${data_buffer}`.match(/charset=([^"]*)/) || []
    resolve(charser ? `${enc.convert(data_buffer, 'utf8', charser)}` : data_buffer)
  })
}))

app.get('*', async (req, res) => res.send(await convert_url(`${baseurl}/${req.url}`)))

app.listen(process.env.PORT || 3000)