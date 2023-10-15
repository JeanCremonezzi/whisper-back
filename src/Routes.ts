import { Router, Request, Response } from "express";
import { User } from "./Database/Models/User/User";
import { Encode, Decode } from "./Utils/HashPassword";
import ShortUniqueId from "short-unique-id";
import jwt from 'jsonwebtoken';

const uid = new ShortUniqueId({ length: 4, dictionary: 'alphanum_upper' });

const routes = Router();

routes.post('/user', async (req: Request, res: Response) => {
    const { username, email, password, tag } = req.body;

    const emailExists = await User.findOne({ email});
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
})

routes.post('/user/signin', async (req: Request, res: Response) => {
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
})

routes.get('/users/search', async (req: Request, res: Response) => {
    const username = req.query.username?.toString().toLowerCase()
    const tag = req.query.tag?.toString().toUpperCase()

    const filter = tag ? { username: username, tag } : { username }

    const token = jwt.verify(req.cookies.user_token, process.env.JWT_SECRET!);

    const usersFound = await User.find({...filter, _id: { $ne: token }}).select(["username", "tag", "-_id"])

    res.send(usersFound)
})

export default routes;