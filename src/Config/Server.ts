import 'dotenv/config'
import express, { Express } from 'express'
import { connect } from 'mongoose';
import cors from 'cors';
import routes from '../Routes';

const mongo_host = process.env.DB_HOST;
const mongo_port = process.env.DB_PORT;
const mongo_name = process.env.DB_NAME;

require('dotenv').config()
const port = process.env.PORT;

export const appConfig = async (app: Express) => {
    await connect(`mongodb://${mongo_host}:${mongo_port}/${mongo_name}`)

    app.use(cors({
        origin : "http://localhost:5173",
        credentials: true
    }))

    app.use(express.json())
    app.use(routes)

    app.listen(port, () => {
        console.log(`\nApp running on port ${port}\n`)
    })
} 