import { useState } from 'react'
import styled from 'styled-components'

import FormField from './FormField'

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const sharedControlStyles = `
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid #d8e1f0;
  background: #fff;
`

const Input = styled.input`
  ${sharedControlStyles}
`

const Select = styled.select`
  ${sharedControlStyles}
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
 * Collects airplane creation data and enforces basic validation before submit.
 * @param {{ onSubmit: (values: { model: string, manufacturer: string, capacity: number, prefix: string, status: string }) => Promise<void>, isSubmitting: boolean }} props
 */
function AirplaneForm({ onSubmit, isSubmitting }) {
  const [values, setValues] = useState({
    model: '',
    manufacturer: '',
    capacity: '',
    prefix: '',
    status: 'active'
  })
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

    if (!values.model.trim()) {
      nextErrors.model = 'Model is required.'
    }

    if (!values.manufacturer.trim()) {
      nextErrors.manufacturer = 'Manufacturer is required.'
    }

    if (!values.capacity || Number(values.capacity) <= 0) {
      nextErrors.capacity = 'Capacity must be greater than zero.'
    }

    if (!values.prefix.trim()) {
      nextErrors.prefix = 'Prefix is required.'
    }

    if (!values.status.trim()) {
      nextErrors.status = 'Status is required.'
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
      model: values.model.trim(),
      manufacturer: values.manufacturer.trim(),
      capacity: Number(values.capacity),
      prefix: values.prefix.trim().toUpperCase(),
      status: values.status.trim()
    })

    setValues({ model: '', manufacturer: '', capacity: '', prefix: '', status: 'active' })
    setErrors({})
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormField id="airplane-model" label="Model" error={errors.model}>
        <Input id="airplane-model" name="model" value={values.model} onChange={handleChange} />
      </FormField>

      <FormField id="airplane-manufacturer" label="Manufacturer" error={errors.manufacturer}>
        <Input
          id="airplane-manufacturer"
          name="manufacturer"
          value={values.manufacturer}
          onChange={handleChange}
        />
      </FormField>

      <FormField id="airplane-capacity" label="Capacity" error={errors.capacity}>
        <Input
          id="airplane-capacity"
          name="capacity"
          type="number"
          min="1"
          value={values.capacity}
          onChange={handleChange}
        />
      </FormField>

      <FormField id="airplane-prefix" label="Prefix" error={errors.prefix}>
        <Input id="airplane-prefix" name="prefix" value={values.prefix} onChange={handleChange} />
      </FormField>

      <FormField id="airplane-status" label="Status" error={errors.status}>
        <Select id="airplane-status" name="status" value={values.status} onChange={handleChange}>
          <option value="active">active</option>
          <option value="maintenance">maintenance</option>
          <option value="inactive">inactive</option>
        </Select>
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving airplane...' : 'Create airplane'}
      </Button>
    </Form>
  )
}

export default AirplaneForm
