import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Current user ID' })
  userId: number;

  @ApiProperty({ description: 'Title of post' })
  title: string;

  @ApiProperty({ description: 'Description in post' })
  description: string;

  @ApiProperty({ description: 'Link to image' })
  imageLink: string;

  @ApiProperty({
    description: 'Registration deadline',
    example: '2023-05-14T10:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  readonly registerationDeadline: Date;
}
