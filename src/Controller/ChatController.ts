import { Request, Response } from "express";
import { Chat } from "../Database/Models/Chat/Chat";

export const ChatGetAllController = async (req: Request, res: Response) => {
    const userID = req.body.userData.id;
    const userEmail = req.body.userData.email;

    const chats = await Chat.find({ participants: userID })
        .select("-_id")
        .populate([
            { path: 'participants', select: '-_id email username tag'},
            { path: 'messages.from', select: '-_id email username tag'}
        ])
        .exec()
        
    const transformedChats = chats.map(chat => {
        let newChat = {
            messages: chat.messages,
            user: chat.participants.filter((participant: any) => participant.email !== userEmail)[0]
        }

        return newChat
    })

    res.send(transformedChats)
}