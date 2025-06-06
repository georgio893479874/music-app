import { IsNotEmpty, IsString } from "class-validator";

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  trackId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
