import 'dotenv/config'
import express, { Express } from 'express'
import { connect } from 'mongoose';
import cors from 'cors';
import routes from '../Routes';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { createServer } from 'http';
import { User } from '../Database/Models/User/User';

require('dotenv').config()

export const appConfig = async (app: Express) => {
    await connect(`${process.env.DB_URI}`)
    
    app.use(cors({
        origin : ['http://localhost:5173', 'https://whisper-front.onrender.com'],
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

    const rooms = new Map<string, string>()

    io.use(async (socket, next) => {
        if (!socket.handshake.auth.user || !await User.findOne({email: JSON.parse(socket.handshake.auth.user).email})) {
            next(new Error("Invalid User"));
            return
        }
        
        socket.data.user = JSON.parse(socket.handshake.auth.user)
        next()
    });

    io.on("connection", (socket) => {        
        rooms.set(socket.data.user.email, socket.id)

        socket.on("message", ({message, to}) => {
            if (rooms.has(to)) {
                const toRoom = rooms.get(to)!
                socket.to(toRoom).emit("message", {
                    message,
                    from: socket.data.user.email
                })
            }

            // TODO - PERSISTIR MENSAGEM
        })
        
        socket.on('disconnect', () => {
            rooms.delete(socket.handshake.auth.email)            
        });
    });

    httpServer.listen(process.env.PORT, () => {
        console.log(`\nApp running on port ${process.env.PORT}\n`)
    })
} 