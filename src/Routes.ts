import { Router } from "express";
import { ValidateCookieMiddleware } from "./Middleware/CookieMiddleware";
import { UserLoginController, UserRegisterController, UserSearchController } from "./Controller/UserController";

const routes = Router();

routes.post('/user', UserRegisterController)
routes.post('/user/signin', UserLoginController)
routes.get('/users/search', ValidateCookieMiddleware, UserSearchController)

export default routes;