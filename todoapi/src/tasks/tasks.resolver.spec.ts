import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Task } from './entities/task.entity';

import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

// mocks
import {
  createTaskMock,
  taskListMock,
  taskMock,
  updateTaskMock,
} from './stubs/task.stub';

describe('TasksResolver', () => {
  let resolver: TasksResolver;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksResolver,
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    resolver = module.get<TasksResolver>(TasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks and count', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(taskListMock);

      expect(await resolver.findAll()).toBe(taskListMock);
    });
  });

  describe('createTask', () => {
    it('should return the new task created', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(taskMock);

      expect(await resolver.createTask(createTaskMock)).toBe(taskMock);
    });
  });

  describe('updateTask', () => {
    it('should return the task updated', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(taskMock);

      expect(await resolver.updateTask(updateTaskMock)).toBe(taskMock);
    });
  });

  describe('removeTask', () => {
    it('should return the task deleted', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(taskMock);

      expect(await resolver.removeTask(1)).toBe(taskMock);
    });
  });
});
