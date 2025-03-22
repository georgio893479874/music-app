import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsEmail() 
  @IsNotEmpty()
  email: string;

  @IsString() 
  @IsNotEmpty()
  @MinLength(6) 
  password: string;

  @IsString() 
  firstname: string;

  @IsString() 
  lastname: string;
}
