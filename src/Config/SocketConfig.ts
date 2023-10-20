import { Express } from 'express'
import { createServer } from "http";
import { Server } from "socket.io";
import { User } from "../Database/Models/User/User";

export const SocketConfig = (app: Express) => {
    const rooms = new Map<string, string>()

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    io.use(async (socket, next) => {
        if (!socket.handshake.auth.user || !await User.findOne({ email: socket.handshake.auth.user.email })) {
            next(new Error("Invalid User"));
            return
        }
        
        socket.data.user = socket.handshake.auth.user
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

    return httpServer
}