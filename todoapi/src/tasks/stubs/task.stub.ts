import { Task } from '../entities/task.entity';

export const taskMock: Task = {
  id: 1,
  description: 'Example task',
  selected: false,
  isActive: true,
  createdAt: new Date('2022-07-26T03:13:40.356Z'),
  updatedAt: new Date('2022-07-26T03:13:40.356Z'),
};

export const createTaskMock = {
  description: 'Example task',
};

export const updateTaskMock = {
  id: 1,
  description: 'Example task',
};

export const taskListMock = {
  count: 1,
  tasks: [taskMock],
};
