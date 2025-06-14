import { IsString, IsOptional } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  hostId: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}
