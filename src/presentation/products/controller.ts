import { Request, Response } from "express";
import { CustomError } from '../../domain/errors/custom.error';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CreateProductDto } from '../../domain/dtos/products/create-product.dto';
import { ProductService } from '../services/product.service';



export class ProductController {

  constructor(
    private readonly productService: ProductService
  ){}

  private handleError = (error: any, res: Response) => {
    if(error instanceof CustomError){
      return res.status(error.statusCode).json({ error: error.message });
    }
  
    return res.status(500).json({ error: 'Internal server error' });
  }


  createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id
    });
    if(error) return res.status(400).json(error);

    this.productService.create(createProductDto!)
      .then(product => res.status(201).json(product))
      .catch(error => this.handleError(error, res));


  }

  getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if(error) return res.status(400).json(error);

    this.productService.list(paginationDto!)
      .then(products => res.status(200).json(products))
      .catch(error => this.handleError(error, res));
  }

  
}