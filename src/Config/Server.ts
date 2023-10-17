import 'dotenv/config'
import express, { Express } from 'express'
import { connect } from 'mongoose';
import cors from 'cors';
import routes from '../Routes';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { createServer } from 'http';

require('dotenv').config()

export const appConfig = async (app: Express) => {
    await connect(`${process.env.DB_URI}`)
    
    app.use(cors({
        origin : ['http://localhost:5173'],
        credentials: true
    }))

    app.use(express.json())
    app.use(cookieParser())
    app.use(routes)

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    io.on("connection", (socket) => {
        socket.on("message", (message) => { 
            socket.broadcast.emit("message", message)
        })
    });

    httpServer.listen(process.env.PORT, () => {
        console.log(`\nApp running on port ${process.env.PORT}\n`)
    })
} 