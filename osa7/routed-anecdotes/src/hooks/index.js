import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}


export const useReset = (fields) => {
  return () => {
    fields.forEach(field => field.onChange({ target: { value: '' } }))
  }
}
