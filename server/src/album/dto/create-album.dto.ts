import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  releaseDate: string;

  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsString()
  @IsOptional()
  genreId?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;
}