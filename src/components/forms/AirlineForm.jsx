import { useState } from 'react'
import styled from 'styled-components'

import FormField from './FormField'

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Button = styled.button`
  border: 0;
  padding: 0.95rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
`

/**
 * Collects and validates airline creation data before dispatching mutations.
 * @param {{ onSubmit: (values: { name: string, hub: string }) => Promise<void>, isSubmitting: boolean }} props
 */
function AirlineForm({ onSubmit, isSubmitting }) {
  const [values, setValues] = useState({ name: '', hub: '' })
  const [errors, setErrors] = useState({})

  const handleChange = event => {
    const { name, value } = event.target
    setValues(currentValues => ({
      ...currentValues,
      [name]: value
    }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required.'
    }

    if (!values.hub.trim()) {
      nextErrors.hub = 'Hub is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit({
      name: values.name.trim(),
      hub: values.hub.trim()
    })

    setValues({ name: '', hub: '' })
    setErrors({})
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormField id="airline-name" label="Airline name" error={errors.name}>
        <Input id="airline-name" name="name" value={values.name} onChange={handleChange} />
      </FormField>

      <FormField id="airline-hub" label="Hub" error={errors.hub}>
        <Input id="airline-hub" name="hub" value={values.hub} onChange={handleChange} />
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving airline...' : 'Create airline'}
      </Button>
    </Form>
  )
}

export default AirlineForm
