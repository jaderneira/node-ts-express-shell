import { Request, Response } from "express";


export class AuthController {

    constructor() {}

    registerUser = (req: Request, res: Response) => {

        res.json({ message: 'Register user' });
    }

    loginUser = (req: Request, res: Response) => {
        res.json({ message: 'Login user' });
    }

    validateEmail = (req: Request, res: Response) => {
        res.json({ message: 'Validate email' });
    }
}