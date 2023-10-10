import {Request, Response} from 'express';
import 'dotenv/config'

require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`\nApp running on port ${port}\n`)
})
