import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Title of post' })
  title: string;

  @ApiProperty({ description: 'Description in post' })
  description: string;

  @ApiProperty({ description: 'Link to image' })
  imageLink: string;

  @ApiProperty({ description: 'Registration deadline' })
  registerationDeadline: string;
}
