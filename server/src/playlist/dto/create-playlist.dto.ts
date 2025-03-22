import { IsNotEmpty, IsString, IsUUID, MaxLength, IsOptional } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MaxLength(255, { message: 'Name is too long. Maximum length is 255 characters.' })
  name: string;

  @IsUUID()
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  userId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description is too long. Maximum length is 500 characters.' })
  description?: string;

  @IsString()
  coverPhoto: string;

  @IsOptional()
  createdAt?: Date;
}
