export async function fetchTodos() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=10',
  )
  return await response.json()
}

export async function createTodo(todoTitle: string) {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify({
      title: todoTitle,
      completed: false,
      userId: 1,
    }),
  })

  return await response.json()
}

export async function deleteTodoById(id: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
    {
      method: 'DELETE',
    },
  )

  return await response.json()
}