
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class StartDto {

  @ApiProperty({ "example": "A single tweet ui component with like, repose and share buttons" })
  @IsString()
  readonly description: string;
}
