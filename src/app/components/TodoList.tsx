'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTodo, deleteTodoById, fetchTodos } from '../api'
import Todo from './Todo'
import { TodoType } from './Todo'
import { useState } from 'react'
import { countCompletedTasks, countUncompletedTasks } from '../utils/helpers'

export default function Todos() {
  const [newTodo, setNewTodo] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  const addTodo = useMutation({
    mutationFn: async (newTodo: string) => await createTodo(newTodo),

    // optimistically add a todo
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // snapshot the previous value
      const previousTodos = queryClient.getQueryData<TodoType[]>(['todos'])

      // optimistically update the cache with the new todo
      queryClient.setQueryData(['todos'], (oldTodos: TodoType[] = []) => [
        { id: Date.now(), title: newTodo, completed: false },
        ...oldTodos,
      ])
      // a temporary and fake todo since jsonplaceholder doesn't actually save anything

      // return a context object with the snapshotted value
      return { previousTodos }
    },
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
    onSettled: () => setNewTodo(''),
  })

  const deleteTodo = useMutation({
    mutationFn: async (id: number) => await deleteTodoById(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<TodoType[]>(['todos'])

      queryClient.setQueryData(
        ['todos'],
        previousTodos?.filter((item) => item.id !== id),
      )

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
  })

  return (
    <main className='flex flex-col items-center pt-10 pb-12 px-[1em]'>
      <h1 className='font-bold text-[1.5rem] mb-4'>Task Manager 📝</h1>
      <p className='text-[1.25rem] mb-[1.75em] text-center'>
        Stay organized and maximize your productivity
      </p>
      <label className='flex flex-col items-center'>
        <p className='text-[1.1875rem] font-medium mb-[0.55em]'>
          Got a task to add?
        </p>
        <input
          type='text'
          className='w-[300px] sm:w-[390px] text-[1rem] border-[3px] border-[#65a4ed] focus:bg-[#8bbbf3] focus:text-white focus:outline-none focus:border-none rounded-[5px] focus:pl-[calc(0.5em+3px)] focus:py-[calc(0.375em+2.4px)] focus:pr-[calc(0.25em+3px)] pl-[0.5em] pr-[0.25em] py-[0.375em] mb-4'
          placeholder='Buy groceries at Silpo...'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </label>
      <button
        className='py-[0.5em] px-[1.75em] cursor-pointer disabled:cursor-not-allowed bg-[#65a4ed] hover:bg-transparent hover:text-[#63a2eb] hover:box-border hover:border-[2px] hover:px-[calc(1.75em-1.6px)] hover:py-[calc(0.5em-1.6px)] hover:border-[#63a2eb] font-medium rounded-[6px] mb-[2.5em] sm:mb-[2.85em] text-[var(--background)]'
        disabled={!newTodo.trim()}
        onClick={() => addTodo.mutate(newTodo)}
      >
        Add it!
      </button>
      {data && (
        <div className='w-full max-w-[1000px] flex flex-col items-center'>
          <span className='h-[2px] bg-[#609ce1] w-full mb-6'></span>
          <div className='flex flex-col items-center text-center gap-[0.5em] mb-8'>
            <p className='text-[1.25rem] font-semibold'>{data.length} task{data.length > 1 ? "s" : ""}</p>
            <p className='text-[1.125rem]'>
              You have{' '}
              <span className='font-semibold'>{countCompletedTasks(data)}</span>{' '}
              🎯 completed task{countCompletedTasks(data) > 1 ? "s" : ""} and{' '}
              <span className='font-semibold'>
                {countUncompletedTasks(data)}
              </span>{' '}
              ⏳ uncompleted task{countUncompletedTasks(data) > 1 ? "s" : ""}
            </p>
          </div>
          <div className='flex flex-col gap-8 md:flex-row md:flex-wrap md:justify-around md:items-center sm:gap-[2.75em]'>
            {data.map((todo: TodoType) => (
              <Todo
                key={todo.id}
                id={todo.id}
                title={todo.title}
                completed={todo.completed}
                deleteTodo={() => deleteTodo.mutate(todo.id)}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}