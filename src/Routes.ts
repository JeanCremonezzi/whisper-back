import { Router, Request, Response } from "express";
import { User } from "./Database/Models/User/User";
import { Encode } from "./Utils/HashPassword";

const routes = Router();

routes.post('/user', async (req: Request, res: Response) => {
    const emailExists = await User.findOne({ email: req.body.email});
    if (emailExists) {
        res.status(409).send("Email já cadastrado!")
        return
    }

    const userTagExists = await User.findOne({ username: req.body.username.toLowerCase(), tag: req.body.tag });
    if (userTagExists) {
        res.status(409).send("Combinação de nome de usuário e tag inválida!")
        return
    }
    
    await new User({
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        tag: req.body.tag,
        password: Encode(req.body.password)
    }).save()

    res.send("Usuário foi cadastrado!")
})

export default routes;