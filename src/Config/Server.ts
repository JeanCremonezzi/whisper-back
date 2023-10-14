import 'dotenv/config'
import express, { Express } from 'express'
import { connect } from 'mongoose';
import cors from 'cors';
import routes from '../Routes';

const mongo_host = process.env.DB_HOST;
const mongo_port = process.env.DB_PORT;
const mongo_name = process.env.DB_NAME;

require('dotenv').config()

export const appConfig = async (app: Express) => {
    await connect(`mongodb://${mongo_host}:${mongo_port}/${mongo_name}`)

    app.use(cors({
        origin : process.env.CLIENT_ORIGIN,
        credentials: true
    }))

    app.use(express.json())
    app.use(routes)

    app.listen(process.env.PORT, () => {
        console.log(`\nApp running on port ${process.env.PORT}\n`)
    })
} 