import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../Database/Models/User/User";

export const ValidateCookie = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.user_token) return res.status(400).send("Cookie inválido");

    const decodedToken = jwt.verify(req.cookies.user_token, process.env.JWT_SECRET!)
    const user = await User.findById(decodedToken).select("-password")

    if (!user) return res.status(401).send("Usuário não encontrado")

    req.body.userData = user

    next();
}