import { useCallback, useEffect, useState } from "react"

export class CancelError extends Error {
  public constructor(message: string) {
    super(message)
    this.name = "CancelError"
  }
}

export class FetchError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export interface UseStatefulRequestOptions<State> {
  initialState: State,
  initialLoading?: boolean
}

export interface UseStatelessRequestOptions {
  initialLoading?: boolean
}

export interface StatefulRequestOptions<State> extends RequestInit {
  url: URL | RequestInfo,
  onResponse: (response: Response) => Promise<State>;
  timeoutInMilliseconds?: number
}

export interface StatelessRequestOptions extends RequestInit {
  url: URL | RequestInfo,
  onResponse?: (response: Response) => void;
  timeoutInMilliseconds?: number
}

export const useStatefulRequest = <State>(options: UseStatefulRequestOptions<State>) => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(options.initialLoading || false)
  const [state, setState] = useState<State>(options.initialState)
  const [abortController, setAbortController] = useState(new AbortController())

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(async ({ url, onResponse, timeoutInMilliseconds, ...options }: StatefulRequestOptions<State>) => {
    try {
      const newAbortController = new AbortController()

      setAbortController(newAbortController)
      setError(null)
      setLoading(true)

      if (timeoutInMilliseconds !== undefined) {
        setTimeout(() => newAbortController.abort(), timeoutInMilliseconds);
      }

      await fetch(url, {
        ...options,
        signal: newAbortController.signal
      }).then(response => {
        return onResponse(response);
      }).then(newData => {
        setState(newData);
      }).catch(error => {
        const errorInstance = error instanceof Error && error.name === "AbortError" ? new CancelError("Request has been canceled") : error;
        setError(errorInstance);
      }).finally(() => {
        setLoading(false)
      })
    } catch (error) {
      if (!(error instanceof Error)) {
        setError(new Error(String(error)));

        return;
      }

      if (error.message === "Failed to fetch" || error.message === "Load failed") {
        setError(new FetchError(error.message));
        
        return;
      }

      setError(error);
    }
  }, []);

  useEffect(() => {
    cancel();
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

export const useStatelessRequest = (options?: UseStatelessRequestOptions) => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(options?.initialLoading ?? false)
  const [abortController, setAbortController] = useState(new AbortController())

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(async ({ url, onResponse, timeoutInMilliseconds, ...options }: StatelessRequestOptions) => {
    try {
      const newAbortController = new AbortController()

      setAbortController(newAbortController)
      setError(null)
      setLoading(true)
      
      if (timeoutInMilliseconds !== undefined) {
        setTimeout(() => newAbortController.abort(), timeoutInMilliseconds);
      }

      await fetch(url, {
        ...options,
        signal: newAbortController.signal
      }).then(response => {
        if (onResponse) {
          return onResponse(response);
        }
      }).catch(error => {
        const errorInstance = error instanceof Error && error.name === "AbortError" ? new CancelError("Request has been canceled") : error;
        setError(errorInstance);
      }).finally(() => {
        setLoading(false)
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        setError(new Error(String(error)));

        return;
      }

      if (error.message === "Failed to fetch" || error.message === "Load failed") {
        setError(new FetchError(error.message));
        
        return;
      }

      setError(error);
    }
  }, []);
  
  useEffect(() => {
    cancel();
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
