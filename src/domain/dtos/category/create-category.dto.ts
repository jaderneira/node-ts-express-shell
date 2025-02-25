

export class CreateCategoryDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ){}

  static create(object: {[key: string]: any}): [string?, CreateCategoryDto?] {
    const { name, available = false } = object;
    let availableValue = available;

    if(!name) return ['Name is required'];
    if(typeof available !== 'boolean') {
      availableValue = (available === 'true')
    }

    return [undefined, new CreateCategoryDto(name, availableValue)];
  }

  
} 

  