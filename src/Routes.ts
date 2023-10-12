import { Router, Request, Response } from "express";
import { User } from "./Database/Models/User/User";
import { Encode } from "./Utils/HashPassword";
import ShortUniqueId from "short-unique-id";

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

export default routes;