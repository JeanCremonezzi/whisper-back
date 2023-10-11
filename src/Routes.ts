import { Router, Request, Response } from "express";
const routes = Router();

routes.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!')
})

export default routes;