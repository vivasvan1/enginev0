import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;
}
