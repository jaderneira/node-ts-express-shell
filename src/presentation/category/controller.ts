import { Request, Response } from "express";
import { CustomError } from '../../domain/errors/custom.error';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { CategoryService } from '../services/category.service';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';



export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService
  ){}

  private handleError = (error: any, res: Response) => {
    if(error instanceof CustomError){
      return res.status(error.statusCode).json({ error: error.message });
    }
  
    return res.status(500).json({ error: 'Internal server error' });
  }


  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if(error) return res.status(400).json(error);

    this.categoryService.create(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json(category))
      .catch(error => this.handleError(error, res));


  }

  getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if(error) return res.status(400).json(error);

    this.categoryService.list(paginationDto!)
      .then(categories => res.status(200).json(categories))
      .catch(error => this.handleError(error, res));
  }

  
}