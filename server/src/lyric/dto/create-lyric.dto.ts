import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateLyricDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  timestamp: number;

  @IsString()
  @IsNotEmpty()
  trackId: string;
}
