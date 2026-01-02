import { IsArray, IsOptional, IsString } from 'class-validator';

export class GoogleUrlDto {
  @IsOptional()
  @IsString()
  redirectTo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];
}
