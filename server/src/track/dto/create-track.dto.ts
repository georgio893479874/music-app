import { IsString, IsInt, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;

  @IsInt()
  duration: number;

  @IsUUID()
  albumId: string;

  @IsUUID()
  authorId: string;

  @IsString()
  audioFilePath: string;

  @IsString()
  coverImagePath: string;
}
