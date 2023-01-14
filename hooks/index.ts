import { useCallback, useMemo, useState } from "react"

export class CancelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CancelError"
  }
}

export interface UseRequestOptions<Data> {
  initialPath: string;
  initialUrl: string;
  initialQueries: Record<string, string>;
  initialData: Data;
  initialOptions: RequestInit;
  resolver: (response: Response) => Promise<Data>
}

export const useRequest = <Data>({initialUrl, initialPath, initialQueries, initialData, initialOptions, resolver}: UseRequestOptions<Data>) => {
  const [url, setUrl] = useState(initialUrl)
  const [path, setPath] = useState(initialPath)
  const [queries, setQueries] = useState(initialQueries)
  const [options, setOptions] = useState<RequestInit>(initialOptions)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())
  const [data, setData] = useState(initialData)

  const stringifiedQueries = useMemo(() => {
    const queryEntries = Object.entries(queries)

    if (queryEntries.length === 0) {
      return ""
    }

    return `?${new URLSearchParams(queryEntries).toString()}`
  }, [queries])

  const cancel = useCallback(() => {
    abortController.abort()
  }, [abortController])

  const request = useCallback(() => {
    const newAbortController = new AbortController()

    setAbortController(newAbortController)
    setError(null)
    setLoading(true)

    const endpoint = new URL(`${path}${stringifiedQueries}`, url)

    fetch(endpoint, {
      ...options,
      signal: newAbortController.signal
    }).then(resolver).then(newData => {
      setData(newData)
    }).catch(error => {
      if (error instanceof Error && error.name === "AbortError") {
        setError(new CancelError("Request has been canceled"))
        return
      }

      setError(error)
    }).finally(() => {
      setLoading(false)
    })
  }, [options, url, stringifiedQueries, path])

  return {
    stringifiedQueries,
    queries,
    path,
    url,
    data,
    error,
    loading,
    setQueries,
    setUrl,
    setPath,
    setData,
    setError,
    setLoading,
    abortController,
    setAbortController,
    setOptions,
    cancel,
    request
  }
}
