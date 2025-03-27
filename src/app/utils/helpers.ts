import { TodoType } from '../components/Todo'

export function countCompletedTasks(data: TodoType[]) {
  let count = 0
  const newArr = data.map((todo) => (todo.completed ? count++ : count))
  return count
}

export function countUncompletedTasks(data: TodoType[]) {
  let count = 0
  const newArr = data.map((todo) => (!todo.completed ? count++ : count))
  return count
}