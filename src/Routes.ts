import { Router } from "express";
import { ValidateCookieMiddleware } from "./Middleware/CookieMiddleware";
import { UserLoginController, UserRegisterController, UserSearchController } from "./Controller/UserController";
import { ChatGetAllController } from "./Controller/ChatController";

const routes = Router();

routes.post('/user', UserRegisterController)
routes.post('/user/signin', UserLoginController)
routes.get('/users/search', ValidateCookieMiddleware, UserSearchController)

routes.get('/chats', ValidateCookieMiddleware, ChatGetAllController)

export default routes;