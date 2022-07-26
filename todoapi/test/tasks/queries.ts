export const getTasksQuery = () => `
  query {
    findAll {
      count 
      tasks {
        id
        description
        selected
      }
    }
  }
`;

export const addTaskMutation = () => `
  mutation ($createTaskInput: CreateTaskInput!) {
    createTask (createTaskInput: $createTaskInput) {
      description
      id
      selected
    }
  }
`;

export const removeTaskMutation = () => `
  mutation ($id: Int!) {
    removeTask (id :$id) {
      selected
      description
      id
    }
  }
`;

export const updateTaskMutation = () => `
  mutation ($fields: UpdateTaskInput!) {
    updateTask (updateTaskInput: $fields) {
      selected
      description
      id
    }
  }
`;

export const getSingleTaskQuery = () => `
  query ($id: Int!) {
    findOne (id: $id) {
      id
      description
      selected
      createdAt
      updatedAt
    }
  }
`;
