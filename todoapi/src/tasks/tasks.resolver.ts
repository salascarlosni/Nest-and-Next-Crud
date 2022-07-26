import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';

import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

import { TaskList } from './entities/taskList.entity';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task, { description: 'create a new task' })
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.tasksService.create(createTaskInput);
  }

  @Query(() => TaskList, { description: 'Get a list of tasks' })
  async findAll() {
    return this.tasksService.findAll();
  }

  @Query(() => Task, { description: 'Get a specific task' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @Mutation(() => Task, { description: 'Update an existing task' })
  async updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    const task = await this.tasksService.update(
      updateTaskInput.id,
      updateTaskInput,
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @Mutation(() => Task, { description: 'Delete an existing tasks' })
  async removeTask(@Args('id', { type: () => Int }) id: number) {
    const task = await this.tasksService.remove(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
