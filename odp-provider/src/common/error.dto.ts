import { ApiProperty } from '@nestjs/swagger';

export class Error {
  @ApiProperty({ pattern: '[A-Z_]+', example: 'DESCRIPTIVE_ERROR_CODE' })
  code: string;
}