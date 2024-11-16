import { useState, useCallback, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject } from "react";

export interface HttpRequestOptions {
  headers?: Headers
  credentials?: RequestCredentials,
  cache?: RequestCache,
  integrity?: string,
  keepAlive?: boolean,
  mode?: RequestMode,
  priority?: RequestPriority,
  redirect?: RequestRedirect,
  referrer?: string,
  referrerPolicy?: ReferrerPolicy,
  signal?: AbortSignal,
}

export const httpRequest = (options: HttpRequestOptions = {}) => ({
  withMethod: (method: string) => ({
    withUrl: (url: string) => ({
      withBody: (body: string) => ({
        withHeader: (name: string, value: string) => {
          const headers = new Headers([
            ...options.headers?.entries() ?? [],
            [name, value]
          ]);

          return httpRequest({ ...options, headers })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withHeaders: (headers: Headers) => {
          return httpRequest({ ...options, headers })
            .withMethod(method)
            .withUrl(url);
        },
        withoutHeaders: () => {
          return httpRequest({ ...options, headers: new Headers() })
            .withMethod(method)
            .withUrl(url)
            .withBody(body)
        },
        withoutHeader: (name: string) => {
          return httpRequest({ ...options, headers: new Headers([...options.headers?.entries().filter(([headerName]) => headerName !== name) ?? []]) })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withIntegrity: (integrity: string) => {
          return httpRequest({ ...options, integrity })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultIntegrity: () => {
          return httpRequest({ ...options, integrity: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withReferrer: (referrer: string) => {
          return httpRequest({ ...options, referrer })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultReferrer: () => {
          return httpRequest({ ...options, referrer: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withCache: (cache: RequestCache) => {
          return httpRequest({ ...options, cache })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultCache: () => {
          return httpRequest({ ...options, cache: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withCredentials: (credentials: RequestCredentials) => {
          return httpRequest({ ...options, credentials })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultCredentials: () => {
          return httpRequest({ ...options, credentials: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withMode: (mode: RequestMode) => {
          return httpRequest({ ...options, mode })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultMode: () => {
          return httpRequest({ ...options, mode: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withPriority: (priority: RequestPriority) => {
          return httpRequest({ ...options, priority })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultPriority: () => {
          return httpRequest({ ...options, priority: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withRedirect(redirect: RequestRedirect) {
          return httpRequest({ ...options, redirect })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withDefaultRedirect: () => {
          return httpRequest({ ...options, redirect: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withSignal: (signal: AbortSignal) => {
          return httpRequest({ ...options, signal })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withoutSignal: () => {
          return httpRequest({ ...options, signal: undefined })
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        withUri: (uri: string) => {
          const urlWithoutEndingSlash = url.replace(/(\s*\/*$\s*)*/g, "");
          const uriWithoutStartingSlash = uri.replace(/^(\s*\/*\s*)*/g, "");

          return httpRequest(options)
            .withMethod(method)
            .withUrl(`${urlWithoutEndingSlash}/${uriWithoutStartingSlash}`)
            .withBody(body);
        },
        withoutUri: () => {
          return httpRequest(options)
            .withMethod(method)
            .withUrl(url)
            .withBody(body);
        },
        send: () => {
          return fetch(url, {
            ...options,
            method,
            body: body || undefined
          });
        }
      }),

    })
  })
});

export const GET = (options: HttpRequestOptions = {}) => ({
  withUrl: (url: string) => {
    return httpRequest(options).withMethod("GET").withUrl(url).withBody("");
  }
});

export const POST = (options: HttpRequestOptions = {}) => ({
  withUrl: (url: string) => ({
    withBody: (body: string) => {
      return httpRequest(options).withMethod("GET").withUrl(url).withBody(body);
    }
  })
});

export const PATCH = httpRequest;

export const DELETE = (options: HttpRequestOptions) => httpRequest(options).withMethod("DELETE");
  
export const HEAD = (options: HttpRequestOptions) => ({
  withUrl: (url: string) => {
    return httpRequest(options).withMethod("HEAD").withUrl(url).withBody("");
  } 
});

export const OPTIONS = (options: HttpRequestOptions) => ({
  withUrl: (url: string) => {
    return httpRequest(options).withMethod("OPTIONS").withUrl(url).withBody("");
  } 
});

export const TRACE = (options: HttpRequestOptions) => ({
  withUrl: (url: string) => {
    return httpRequest(options).withMethod("OPTIONS").withUrl(url).withBody("");
  } 
});

export const kind = Symbol("kind");

export interface DiscriminatedError {
  [kind]: string
}

export class NetworkError implements DiscriminatedError {
  public readonly [kind] = "NetworkError";
}

export class CancelError implements DiscriminatedError {
  public readonly [kind] = "CancelError";
}

export class UnexpectedError implements DiscriminatedError {
  public readonly [kind] = "UnexpectedError"

  public constructor(public readonly message: string) {}
}

export class ExpectedError implements DiscriminatedError {
  public readonly [kind] = "ExpectedError";

  public constructor(public readonly message: string) {}
}

export function isError(input: unknown): input is DiscriminatedError {
  return typeof input === "object" && input !== null && kind in input;
}

export function match<Output, GenericError extends DiscriminatedError>(error: GenericError, cases: { [Key in GenericError[typeof kind]]: (error: Extract<GenericError, {[kind]: Key }>) => Output }): Output {
  const errorKind = error[kind] as GenericError[typeof kind];

  return cases[errorKind](error as Extract<GenericError, { [kind]: typeof errorKind }>);
}

export type Options<State> = {
  initialState: State,
  initialLoading?: boolean
}

export type RequestOptions<State> = Omit<RequestInit, "signal"> & {
  url: string,
  onResponse: (response: Response) => Promise<State | ExpectedError>
}

export type CancelFunction = () => void;

export type RequestFunction<State> = (options: RequestOptions<State>) => void;

export type ResetFunction = () => void;

export type StatefulRequest<State> = {
  state: State | NetworkError | CancelError | UnexpectedError | ExpectedError,
  setState: Dispatch<SetStateAction<State | NetworkError | CancelError | UnexpectedError | ExpectedError>>,
  request: RequestFunction<State>,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  abortControllerRef: MutableRefObject<AbortController>
  cancel: CancelFunction,
  reset: ResetFunction
}

export type StatelessRequest = StatefulRequest<void>;

export const useStatefulRequest = <State = void>({ initialLoading = false, initialState }: Options<State>): StatefulRequest<State> => {
  const [state, setState] = useState<State | UnexpectedError | CancelError | NetworkError | ExpectedError>(initialState);
  const [loading, setLoading] = useState(initialLoading);
  const abortControllerRef = useRef(new AbortController());

  const cancel: CancelFunction = useCallback(() => {
    abortControllerRef.current.abort();
  }, []);

  const reset: ResetFunction = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const request: RequestFunction<State> = useCallback(({ onResponse, url, ...options }) => {
    setState(initialState);
    setLoading(true);
    abortControllerRef.current = new AbortController();

    fetch(url, {
      ...options,
      signal: abortControllerRef.current.signal
    }).then(response => {
      return onResponse(response);
    }).then(newState => {
      setState(newState);
    }).catch(error => {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setState(new CancelError);
          return;
        }

        if (error.message === "Failed to fetch" || error.message === "Load failed") {
          setState(new NetworkError);
          return;
        }

        setState(new UnexpectedError(error.message));
        return;
      }

      setState(new UnexpectedError(String(error)));

    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    }
  }, []);

  return {
    request,
    abortControllerRef,
    cancel,
    state,
    setState,
    loading,
    setLoading,
    reset
  }
};

export const useStatelessRequest = ({ initialLoading = false }: Omit<Options<void>, "initialState"> = {}): StatelessRequest => {
  return useStatefulRequest<void>({
    initialState: undefined,
    initialLoading
  });
};
