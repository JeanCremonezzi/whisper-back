import { Request, Response } from "express";
import { User } from "../Database/Models/User/User";
import ShortUniqueId from "short-unique-id";
import { Decode, Encode } from "../Utils/HashPassword";
import jwt from 'jsonwebtoken';

const uid = new ShortUniqueId({ length: 4, dictionary: 'alphanum_upper' });

export const UserRegisterController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        res.status(409).send("Email já cadastrado!")
        return
    }
    
    await new User({
        username: username.toLowerCase(),
        email,
        tag: uid.rnd(),
        password: Encode(password)
    }).save()

    res.send("Usuário foi cadastrado!")
}

export const UserLoginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists || !Decode(password, userExists.password)) {
        res.status(404).send("Email e/ou senha inválidos!");
        return
    }
    
    const token = jwt.sign(userExists.id, process.env.JWT_SECRET!);

    res.cookie("user_token", token, {
        httpOnly: false
    }).json({
        username: userExists.username,
        email: userExists.email,
        tag: userExists.tag
    })
}

export const UserSearchController = async (req: Request, res: Response) => {
    const username = req.query.username?.toString().toLowerCase()
    const tag = req.query.tag?.toString().toUpperCase()
    const userID = req.body.userData.id

    const filter = tag ? { username: username, tag } : { username }  

    const usersFound = await User.find({...filter, _id: { $ne: userID }}).select(["username", "tag", "email", "-_id"])

    res.send(usersFound)
}