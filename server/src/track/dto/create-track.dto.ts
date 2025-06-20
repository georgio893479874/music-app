import { IsString, IsInt, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;

  @IsUUID()
  albumId: string;

  @IsUUID()
  authorId: string;

  @IsString()
  audioFilePath: string;
}
