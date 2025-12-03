import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => Int, { nullable: false })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
