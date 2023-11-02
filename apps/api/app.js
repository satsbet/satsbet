const express = require('express')
const app = express()
const port = 3000

app.get('/health', (req, res) => {
  res.send({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
