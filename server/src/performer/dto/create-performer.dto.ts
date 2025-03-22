import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePerformerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}
