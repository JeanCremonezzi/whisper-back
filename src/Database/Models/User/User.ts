import { Schema, model } from 'mongoose';
import { IUser } from "./UserInterface";

const userSchema = new Schema<IUser>({
    username: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    tag: { type: String, required: true}
});

export const User = model<IUser>('User', userSchema);