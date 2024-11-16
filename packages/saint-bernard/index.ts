import { useState, useCallback, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject } from "react";

export interface HttpRequestOptions {
  body?: string,
  method?: string,
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
  withUrl: (url: string) => ({
    withMethod: (method: string) => {
      return httpRequest({ ...options, method }).withUrl(url);
    },
    withBody: (body: string) => {
      return httpRequest({ ...options, body }).withUrl(url)
    },
    withHeader: (name: string, value: string) => {
      const headers = new Headers([
        ...options.headers?.entries() ?? [],
        [name, value]
      ]);

      return httpRequest({ ...options, headers }).withUrl(url)
    },
    withHeaders: (headers: Headers) => {
      return httpRequest({ ...options, headers }).withUrl(url);
    },
    withoutHeaders: () => {
      return httpRequest({ ...options, headers: new Headers() }).withUrl(url);
    },
    withoutHeader: (name: string) => {
      return httpRequest({ ...options, headers: new Headers([...options.headers?.entries().filter(([headerName]) => headerName !== name) ?? []]) }).withUrl(url);
    },
    withIntegrity: (integrity: string) => {
      return httpRequest({ ...options, integrity }).withUrl(url);
    },
    withDefaultIntegrity: () => {
      return httpRequest({ ...options, integrity: undefined }).withUrl(url);
    },
    withReferrer: (referrer: string) => {
      return httpRequest({ ...options, referrer }).withUrl(url);
    },
    withDefaultReferrer: () => {
      return httpRequest({ ...options, referrer: undefined }).withUrl(url);
    },
    withCache: (cache: RequestCache) => {
      return httpRequest({ ...options, cache }).withUrl(url);
    },
    withDefaultCache: () => {
      return httpRequest({ ...options, cache: undefined }).withUrl(url);
    },
    withCredentials: (credentials: RequestCredentials) => {
      return httpRequest({ ...options, credentials }).withUrl(url);
    },
    withDefaultCredentials: () => {
      return httpRequest({ ...options, credentials: undefined }).withUrl(url);
    },
    withMode: (mode: RequestMode) => {
      return httpRequest({ ...options, mode }).withUrl(url);
    },
    withDefaultMode: () => {
      return httpRequest({ ...options, mode: undefined }).withUrl(url);
    },
    withPriority: (priority: RequestPriority) => {
      return httpRequest({ ...options, priority }).withUrl(url);
    },
    withDefaultPriority: () => {
      return httpRequest({ ...options, priority: undefined }).withUrl(url);
    },
    withRedirect(redirect: RequestRedirect) {
      return httpRequest({ ...options, redirect }).withUrl(url);
    },
    withDefaultRedirect: () => {
      return httpRequest({ ...options, redirect: undefined }).withUrl(url);
    },
    withSignal: (signal: AbortSignal) => {
      return httpRequest({ ...options, signal }).withUrl(url);
    },
    withoutSignal: () => {
      return httpRequest({ ...options, signal: undefined }).withUrl(url);
    },
    withUri: (uri: string) => {
      const urlWithoutEndingSlash = url.replace(/(\s*\/*$\s*)*/g, "");
      const uriWithoutStartingSlash = uri.replace(/^(\s*\/*\s*)*/g, "");

      return httpRequest(options).withUrl(`${urlWithoutEndingSlash}/${uriWithoutStartingSlash}`);
    },
    withoutUri: () => {
      return httpRequest(options).withUrl(url);
    },
    send: () => {
      return fetch(url, options);
    }
  })
});

export const GET = (url: string) => httpRequest().withUrl(url).withMethod("GET");

export const POST = (url: string) => httpRequest().withUrl(url).withMethod("POST")

export const PATCH = (url: string) => httpRequest().withUrl(url).withMethod("PATCH");

export const PUT = (url: string) => httpRequest().withUrl(url).withMethod("PUT");

export const DELETE = (url: string) => httpRequest().withUrl(url).withMethod("DELETE");
  
export const HEAD = (url: string) => httpRequest().withUrl(url).withMethod("HEAD");

export const OPTIONS = (url: string) => httpRequest().withUrl(url).withMethod("OPTIONS");

export const TRACE = (url: string) => httpRequest().withUrl(url).withMethod("TRACE");

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

export type RequestFunctionCallbackOptions = {
  signal: AbortSignal
}

export type CancelFunction = () => void;

export type RequestFunctionCallback<State> = (options: RequestFunctionCallbackOptions) => Promise<State | ExpectedError>

export type RequestFunction<State> = (callback: RequestFunctionCallback<State>) => Promise<void>;

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

  const request: RequestFunction<State> = useCallback(async (callback) => {
    try {
      setState(initialState);
      setLoading(true);
      abortControllerRef.current = new AbortController();

      const state = await callback({
        signal: abortControllerRef.current.signal
      });

      setState(state);
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
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