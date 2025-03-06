import { ProductModel } from '../../data/mongo/models/product.model';
import { CreateProductDto } from '../../domain/dtos/products/create-product.dto';

import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CustomError } from '../../domain/errors/custom.error';



export class ProductService {

  constructor(){}

  create = async (createProductDto: CreateProductDto) => {

    const productExists = await ProductModel.findOne({ name: createProductDto.name });
    if(productExists) throw CustomError.badRequest('Product already exists');

    try {
      const product = new ProductModel(createProductDto);

      await product.save();

      return product

      
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  list = async (paginationDto: PaginationDto) => {

    const { page, limit } = paginationDto;
    

    try {

      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user')
          .populate('category')
      ]);
      
      return {
        page,
        limit,
        total,
        products: products,
      }
      
    } catch (error) {
      throw CustomError.internalServer();
      
    }
  }

  

}