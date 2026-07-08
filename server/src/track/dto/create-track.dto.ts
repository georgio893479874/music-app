import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  albumId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsString()
  audioFilePath: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
