import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Task } from './task.entity';

@ObjectType()
export class TaskList {
  @Field(() => Int)
  count: number;

  @Field(() => [Task])
  tasks: Task[];
}
