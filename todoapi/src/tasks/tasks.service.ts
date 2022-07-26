import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskInput: CreateTaskInput) {
    return this.tasksRepository.save({ ...createTaskInput });
  }

  async findAll() {
    const result = await this.tasksRepository.findAndCountBy({
      isActive: true,
    });

    return {
      tasks: result[0],
      count: result[1],
    };
  }

  async update(id: number, updateTaskInput: UpdateTaskInput) {
    const task = this.findOne(id);

    if (!task) return null;

    return this.tasksRepository.save({
      id: id,
      ...updateTaskInput,
    });
  }

  async findOne(id: number) {
    return this.tasksRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async remove(id: number) {
    const task = await this.findOne(id);

    await this.tasksRepository.update(id, {
      isActive: false,
    });

    return task;
  }
}
