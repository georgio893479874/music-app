import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  releaseDate: Date;

  @IsString()
  @IsNotEmpty()
  artistId: string;

  @IsString()
  @IsNotEmpty()
  genreId: string;

  @IsString()
  @IsOptional()
  coverUrl: string;
}
