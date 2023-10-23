import { Schema, model } from 'mongoose';
import { IChat } from "./ChatInterface";

const chatSchema = new Schema<IChat>(
    { 
        participants: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
        messages: {
            type: [{ 
                message: String, 
                from: { type: Schema.Types.ObjectId, ref: "User" }
            }]
        }
    },
    { versionKey: false }
);

export const Chat = model<IChat>('Chat', chatSchema);