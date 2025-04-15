import { TodoType } from '../components/Todo'

export function countCompletedTasks(data: TodoType[]) {
  const tasksTotal = data.filter(todo => todo.completed).length
  return tasksTotal
}

export function countUncompletedTasks(data: TodoType[]) {
  const tasksTotal = data.filter(todo => !todo.completed).length
  return tasksTotal
}