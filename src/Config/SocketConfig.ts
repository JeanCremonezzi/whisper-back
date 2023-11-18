import { Express } from 'express'
import { createServer } from "http";
import { Server } from "socket.io";
import { User } from "../Database/Models/User/User";
import { Chat } from '../Database/Models/Chat/Chat';

export const SocketConfig = (app: Express) => {
    const rooms = new Map<string, string>()

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    io.use(async (socket, next) => {
        const user = await User.findOne({ email: socket.handshake.auth.user.email }).select("-password")

        if (!socket.handshake.auth.user || !user) {
            next(new Error("Invalid User"));
            return
        }
        
        socket.data.user = user
        next()
    });

    io.on("connection", (socket) => {              
        rooms.set(socket.data.user.email, socket.id)

        socket.on("message", async ({message, to}) => {
            const users = await User.find({ email: { $in: [to, socket.data.user.email] } }).select("-password")
            let chat = await Chat.findOne({ participants: users })

            if (!chat) await new Chat({
                participants: users
            }).save().then(newChat => chat = newChat)

            chat!.messages.push({
                message,
                from: socket.data.user
            })

            chat!.save()

            if (rooms.has(to)) {
                socket.to(rooms.get(to)!).emit("message", {
                    message,
                    from: {
                        email: socket.data.user.email,
                        tag: socket.data.user.tag,
                        username: socket.data.user.username
                    }
                })
            }
        })
        
        socket.on('disconnect', () => {
            rooms.delete(socket.handshake.auth.email)
        });
    });

    return httpServer
}