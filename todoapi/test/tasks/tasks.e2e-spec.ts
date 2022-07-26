import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';

import { addTaskMutation, getTasksQuery, removeTaskMutation } from './queries';

import { TasksModule } from '../../src/tasks/tasks.module';
import { TasksService } from '../../src/tasks/tasks.service';
import { taskMock } from '../../src/tasks/stubs/task.stub';

import { Task } from '../../src/tasks/entities/task.entity';
import { AppModule } from '../../src/app.module';

describe('TaskResolver (e2e)', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;
  let taskService: TasksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        TasksModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Task],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    taskRepository = moduleRef.get('TaskRepository');
    taskService = new TasksService(taskRepository);
  });

  describe('query getTasks', () => {
    it('should retrieve the list of tasks with count', async () => {
      // Add a temporary record to get in gql
      const record = await taskService.create({ ...taskMock });

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: getTasksQuery(),
        });

      expect(statusCode).toBe(200);

      // Get the inserted task and assert that it is returned in the query
      const count = body.data.findAll.count;
      const newTask = body.data.findAll.tasks[0];

      expect(count).toBe(1);

      expect(newTask.id).toBe(record.id);
      expect(newTask.description).toBe(record.description);
      expect(newTask.selected).toBe(record.selected);
    });
  });

  describe('mutation addTask', () => {
    it('should retrieve the new task created', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: addTaskMutation(),
          variables: {
            createTaskInput: {
              description: taskMock.description,
            },
          },
        });

      expect(statusCode).toBe(200);

      // Get the new task created and assert that was inserted with proper values
      const newTask = body.data.createTask;

      expect(newTask.description).toBe(taskMock.description);
      expect(newTask.selected).toBe(taskMock.selected);
    });
  });

  describe('mutation removeTask', () => {
    it('should stop showing up in queries after a task is being deleted', async () => {
      // Add a temporary record to get in gql
      const record = await taskService.create({ ...taskMock });

      const { statusCode } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: removeTaskMutation(),
          variables: {
            id: record.id,
          },
        });

      expect(statusCode).toBe(200);

      // Get all the tasks to assert that is no longer retrieved
      const { body: body2, statusCode: code2 } = await request(
        app.getHttpServer(),
      )
        .post('/graphql')
        .send({
          query: getTasksQuery(),
        });

      expect(code2).toBe(200);

      const count = body2.data.findAll.count;
      expect(count).toBe(0);
    });
  });

  afterEach(async () => {
    // Truncate the test table for isolation
    await taskRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });
});
