import { SignupInput } from '../../graphql';
import { IsNotEmpty } from 'class-validator';

export class SignupDTO extends SignupInput {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}