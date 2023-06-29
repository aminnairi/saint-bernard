import { useCallback, useState } from "react"

export class CancelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CancelError"
  }
}

export interface UseRequestOptions<State> {
  initialState?: State;
}

export interface RequestOptions<State> extends RequestInit {
  url: URL | RequestInfo,
  onResponse?: (response: Response) => Promise<State>;
}

export const useRequest = <Data>(options?: UseRequestOptions<Data>) => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())
  const [state, setState] = useState(options?.initialState)

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(({ url, onResponse, ...options }: RequestOptions<Data>) => {
    const newAbortController = new AbortController()

    setAbortController(newAbortController)
    setError(null)
    setLoading(true)

    fetch(url, {
      ...options,
      signal: newAbortController.signal
    }).then(response => {
      if (onResponse) {
        return onResponse(response);
      }
    }).then(newData => {
      if (newData) {
        setState(newData);
      }
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
