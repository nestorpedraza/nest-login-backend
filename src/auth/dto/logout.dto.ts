import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiPropertyOptional({ enum: ['global', 'local', 'others'] })
  @IsOptional()
  @IsString()
  scope?: 'global' | 'local' | 'others';
}
