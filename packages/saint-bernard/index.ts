import { useState, useCallback, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject } from "react";

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
