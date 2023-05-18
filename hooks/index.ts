import { useCallback, useState } from "react"

export class CancelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CancelError"
  }
}

export interface UseRequestOptions<State> {
  initialState: State;
  resolver: (response: Response) => Promise<State>
}

export interface RequestOptions extends RequestInit {
  url: URL | RequestInfo
}

export const useRequest = <Data>({ initialState, resolver }: UseRequestOptions<Data>) => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())
  const [state, setState] = useState(initialState)

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(({ url, ...options }: RequestOptions) => {
    const newAbortController = new AbortController()

    setAbortController(newAbortController)
    setError(null)
    setLoading(true)

    fetch(url, {
      ...options,
      signal: newAbortController.signal
    }).then(response => {
      return resolver(response);
    }).then(newData => {
      setState(newData);
    }).catch(error => {
      if (error instanceof Error && error.name === "AbortError") {
        setError(new CancelError("Request has been canceled"))
        return
      }

      setError(error)
    }).finally(() => {
      setLoading(false)
    })
  }, []);

  return {
    state,
    error,
    loading,
    setState,
    setError,
    setLoading,
    abortController,
    setAbortController,
    cancel,
    request
  }
}
