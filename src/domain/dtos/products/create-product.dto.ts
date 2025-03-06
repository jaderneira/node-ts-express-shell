import { Validators } from '../../../config/validators';


export class CreateProductDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ){}

  static create(object: {[key: string]: any}): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = object;

    if(!name) return ['Name is required', undefined];
    if(!user) return ['User is required', undefined];
    if(!Validators.isMongoId(user)) return ['Invalid user', undefined];
    if(!category) return ['Category is required', undefined];
    if(!Validators.isMongoId(category)) return ['Invalid category', undefined];

    return [undefined, new CreateProductDto(name, !!available, price, description, user, category)];
  }
}