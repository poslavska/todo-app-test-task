'use client'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'

export type TodoType = {
  id: number
  title: string
  completed: boolean
}

type TodoProps = TodoType & {
  deleteTodo: (id: number) => void
}

export default function Todo({ id, title, completed, deleteTodo }: TodoProps) {
  const [isChecked, setIsChecked] = useState(completed)
  const queryClient = useQueryClient()
  const completedStyle = isChecked ? 'opacity-31' : ''

  const handleCheckboxChange = () => {
    const updatedCompletedStatus = !isChecked
    setIsChecked(updatedCompletedStatus)

    // update the cache to reflect the checkbox change
    queryClient.setQueryData(['todos'], (oldTodos: TodoType[]) => {
      return oldTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedCompletedStatus } : todo,
      )
    })
  }

  return (
    <div className='max-w-[380px] w-full p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400'>
      <div className='flex justify-between gap-[2em] bg-[var(--background)] rounded-[5px] py-[0.625em] px-4'>
        <div className={`flex flex-col ${completedStyle}`}>
          <p className='font-semibold text-[1.125rem]'>Task #{id}</p>
          <label className='flex gap-[0.5em] mt-[1.5em] cursor-pointer'>
            <input
              type='checkbox'
              name='todoCheckbox'
              onChange={handleCheckboxChange}
              checked={isChecked}
            />
            <p
              className={`font-medium text-[1rem] ${isChecked ? 'line-through' : ''}`}
            >
              {title}
            </p>
          </label>
        </div>
        <button className='cursor-pointer' onClick={() => deleteTodo(id)}>
          <AiOutlineDelete
            size={28}
            className={`text-gray-600 text-[1rem] ${completedStyle}`}
          />
        </button>
      </div>
    </div>
  )
}