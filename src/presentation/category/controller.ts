import { Request, Response } from "express";
import { CustomError } from '../../domain/errors/custom.error';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';



export class CategoryController {

  constructor(){}

  private handleError = (error: any, res: Response) => {
    if(error instanceof CustomError){
      return res.status(error.statusCode).json({ error: error.message });
    }
  
    return res.status(500).json({ error: 'Internal server error' });
  }


  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if(error) return res.status(400).json(error);
    // Implementar
    res.json(createCategoryDto);
  }

  getCategories = (req: Request, res: Response) => {
    // Implementar
    res.json({ message: 'Categories listed' });
  }
}