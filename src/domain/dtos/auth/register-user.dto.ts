import { regularExps } from '../../../config/regular-exp';


export class RegisterUserDto {
  
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ){}

  static create(object: { [key:string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if(!name) return ['Name is required'];
    if(!email) return ['Email is required'];
    if(!regularExps.email.test(email)) return ['Email is invalid'];
    if(!password) return ['Password is required'];
    if(password.length < 6) return ['Password must have at least 6 characters'];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}