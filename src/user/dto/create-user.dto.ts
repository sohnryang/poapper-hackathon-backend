import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'POVIS username of user' })
  username: string;

  @ApiProperty({ description: 'POSTECH student ID' })
  studentId: string;

  @ApiProperty({ description: 'Full name of user' })
  fullName: string;

  @ApiProperty({ description: 'Cell phone number of user' })
  phoneNumber: string;

  @ApiProperty({ description: 'Password for user' })
  password: string;
}
