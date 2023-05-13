export default function errorProcessing(e: unknown) {
  let error
  if (e instanceof Error) {
    error = e
  } else if (hasMessage(e)) {
    error = Error(e.message)
  } else {
    error = Error('something went wrong')
  }

  return { error }
}

function hasMessage(x: unknown): x is { message: string } {
  if (x && typeof x === 'object' && 'message' in x) {
    return true
  }

  return false
}
