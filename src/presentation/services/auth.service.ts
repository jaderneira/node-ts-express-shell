import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { envs } from '../../config/envs';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from '../../data/mongo/models/user.model';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { EmailService } from './email.service';


export class AuthService {

  constructor(
    private readonly emailService: EmailService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    
    const existUser = await UserModel.findOne({ email: registerUserDto.email});
    if(existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();


      //TODO email confirmation
      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromJSON(user);

      const token = await JwtAdapter.generateToken({ id: user._id });
      if(!token) throw CustomError.internalServer('Error generating token');

      return {
        user: userEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if(!user) throw CustomError.badRequest('Email or password invalid');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if(!isMatching) throw CustomError.badRequest('Email or password invalid');

    const { password, ...userEntity } = UserEntity.fromJSON(user);

    const token = await JwtAdapter.generateToken({ id: user._id });
    if(!token) throw CustomError.internalServer('Error generating token');

    return {
      user: userEntity,
      token,
    }
  }

  private sendEmailValidationLink = async(email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if(!token) throw CustomError.internalServer('Error generating token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const htmlBody = `
      <h1>Validate your email</h1>
      <h1>Click on the link below to validate your email</h1>
      <a href="${link}">Validate Email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody,
    }

    const isSent = await this.emailService.sendEmail(options);
    if(!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  }

  public validateEmail = async(token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if(!payload) throw CustomError.unauthorized('Invalid token');

    const {email} = payload as {email: string};
    if(!email) throw CustomError.unauthorized('Invalid token');

    const user = await UserModel.findOne({ email });
    if(!user) throw CustomError.unauthorized('Unauthorized');

    user.emailValidated = true;
    await user.save();

    return true;
  }

}