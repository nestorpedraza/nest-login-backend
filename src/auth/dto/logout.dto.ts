import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty()
  @IsString()
  access_token!: string;

  @ApiPropertyOptional({ enum: ['global', 'local', 'others'] })
  @IsOptional()
  @IsString()
  scope?: 'global' | 'local' | 'others';
}
