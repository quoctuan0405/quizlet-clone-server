import { LoginInput } from '../../graphql';
import { IsNotEmpty } from 'class-validator';

export class LoginInputDTO extends LoginInput {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  confirmToken: string;
}
