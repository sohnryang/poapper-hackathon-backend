import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({ description: 'Current user ID' })
  userId: number;
}
