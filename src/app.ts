import express from 'express'
import { appConfig } from './Config/Server';

const app = express()

appConfig(app)

export default app;