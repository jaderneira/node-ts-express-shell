import { CategoryModel } from '../../data/mongo/models/category.model';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';



export class CategoryService {

  constructor(){}

  create = async (createCategoryDto: CreateCategoryDto, user: UserEntity) => {

    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
    if(categoryExists) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available
      };

      
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  list = async (paginationDto: PaginationDto) => {

    const { page, limit } = paginationDto;
    

    try {

      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .exec()
      ]);
      
      return {
        page,
        limit,
        total,
        categories: categories.map(category => ({
          id: category.id,
          name: category.name,
          available: category.available
        }))
      }
      
    } catch (error) {
      throw CustomError.internalServer();
      
    }
  }

  

}