import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from '../../data/mongo/models/user.model';
import { UserEntity } from '../../domain/entities/user.entity';



export class AuthMiddleware {

  static async validateJWT(req: Request, res: Response, next: NextFunction) {

    const authorizarion = req.headers['authorization'];
    if(!authorizarion) return res.status(401).json({ error: 'Unauthorized' });
    if(!authorizarion.startsWith('Bearer')) return res.status(401).json({ error: 'Unauthorized' });

    const token = authorizarion.split(' ').at(-1) || '';

    try {

      const payload = await JwtAdapter.validateToken<{id: string}>(token);
      if(!payload) return res.status(401).json({ error: 'Unauthorized' });

      const user = await UserModel.findById(payload.id);
      if(!user) return res.status(401).json({ error: 'Unauthorized' });

      //TODO: Validate activer user

      req.body.user = UserEntity.fromJSON(user);

      next();
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
      
    }

  }


}