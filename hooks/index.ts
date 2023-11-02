import { useCallback, useState } from "react"

export class CancelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CancelError"
  }
}

export interface UseStatefulRequestOptions<State> {
  initialState: State
}

export interface StatefulRequestOptions<State> extends RequestInit {
  url: URL | RequestInfo,
  onResponse: (response: Response) => Promise<State>;
}

export interface StatelessRequestOptions extends RequestInit {
  url: URL | RequestInfo,
  onResponse?: (response: Response) => void;
}

export const useStatefulRequest = <State>(options: UseStatefulRequestOptions<State>) => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<State>(options.initialState)
  const [abortController, setAbortController] = useState(new AbortController())

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(({ url, onResponse, ...options }: StatefulRequestOptions<State>) => {
    const newAbortController = new AbortController()

    setAbortController(newAbortController)
    setError(null)
    setLoading(true)

    return fetch(url, {
      ...options,
      signal: newAbortController.signal
    }).then(response => {
      return onResponse(response);
    }).then(newData => {
      setState(newData);
    }).catch(error => {
      const errorInstance = error instanceof Error && error.name === "AbortError" ? new CancelError("Request has been canceled") : error;
      setError(errorInstance);
      return Promise.reject(errorInstance);
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

export const useStatelessRequest = () => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(({ url, onResponse, ...options }: StatelessRequestOptions) => {
    const newAbortController = new AbortController()

    setAbortController(newAbortController)
    setError(null)
    setLoading(true)

    return fetch(url, {
      ...options,
      signal: newAbortController.signal
    }).then(response => {
      if (onResponse) {
        return onResponse(response);
      }
    }).catch(error => {
      const errorInstance = error instanceof Error && error.name === "AbortError" ? new CancelError("Request has been canceled") : error;
      setError(errorInstance);
      return Promise.reject(errorInstance);
    }).finally(() => {
      setLoading(false)
    })
  }, []);

  return {
    error,
    loading,
    setError,
    setLoading,
    abortController,
    setAbortController,
    cancel,
    request
  }
}
