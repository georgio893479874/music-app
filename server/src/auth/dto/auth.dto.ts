import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthExtensionDto {
  @IsString()
  id: string;
}

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;
  
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;
}