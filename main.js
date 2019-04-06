require('express')().get('*', ({ url }, res) => require('http').get(`http://home.agh.edu.pl/~maziarz/LabPE/${url}`, (response, data) => response
  .on('data', chunk => data = data ? Buffer.concat([data, chunk]) : chunk)
  .on('end', ([, charser] = `${data}`.match(/charset=([^"]*)/) || []) =>
    res.send(charser ? `${require('encoding').convert(data, 'utf8', charser)}` : data))
)).listen(process.env.PORT || 3000)