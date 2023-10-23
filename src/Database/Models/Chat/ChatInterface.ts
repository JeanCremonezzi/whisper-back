import { Types } from 'mongoose';

export interface IChat {
    participants: Types.ObjectId[];
    messages: [{ 
        message: String;
        from: Types.ObjectId;
    }]
}