import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { fetchTodos } from './api'
import { getQueryClient } from './get-query-client'
import TodoList from './components/TodoList'

export default async function TodosPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoList />
    </HydrationBoundary>
  )
}