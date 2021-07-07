import { FunctionComponent } from 'react'
import { UseFormRegister } from 'react-hook-form'

import { FormData, FormField } from 'types/FormData'

interface InputProps {
  defaultValue: number
  label: string
  id: FormField
  getValues: (id: string) => string
  register: UseFormRegister<FormData>
}

const Input: FunctionComponent<InputProps> = ({ defaultValue, label, id, getValues, register }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold" htmlFor={id}>
        {label}
      </label>
      <input className="p-1 border-2 border-black rounded-sm" defaultValue={defaultValue} id={id} type="number" {...register(id)} /> (
      {parseFloat(getValues(id)) / 16}lb)
    </div>
  )
}

export default Input
