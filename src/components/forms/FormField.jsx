import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-weight: 600;
`

const Hint = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9rem;
`

function FormField({ id, label, error, hint, children }) {
  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <Hint>{hint}</Hint> : null}
      {error ? <ErrorText role="alert">{error}</ErrorText> : null}
    </Wrapper>
  )
}

export default FormField
