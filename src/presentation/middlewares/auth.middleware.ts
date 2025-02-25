import { NextFunction, Request, Response } from 'express';



export class AuthMiddleware {

  static async validateJWT(req: Request, res: Response, next: NextFunction) {

    const authorizarion = req.headers['authorization'];
    if(!authorizarion) return res.status(401).json({ error: 'Unauthorized' });
    if(!authorizarion.startsWith('Bearer')) return res.status(401).json({ error: 'Unauthorized' });

    const token = authorizarion.split(' ').at(-1) || '';

    try {
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
      
    }

  }


}