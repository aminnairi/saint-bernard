# saint-bernard

React Hook for requesting data using the Web API Fetch written in TypeScript

[![NPM](https://badgen.net/npm/v/saint-bernard)](https://www.npmjs.com/package/saint-bernard) [![Coverage Status](https://coveralls.io/repos/github/aminnairi/saint-bernard/badge.svg?branch=production)](https://coveralls.io/github/aminnairi/saint-bernard?branch=production) ![Vulnerabilities](https://badgen.net/snyk/aminnairi/saint-bernard) [![Size](https://badgen.net/bundlephobia/minzip/saint-bernard)](https://bundlephobia.com/package/saint-bernard@latest) [![Types](https://badgen.net/npm/types/saint-bernard)](https://github.com/aminnairi/saint-bernard)

## Summary

- [Requirements](#requirements)
- [Installation](#installation)
- [Uninstallation](#uninstallation)
- [Usage](#usage)
- [Changelog](#changelog)
- [Code of conduct](#code-of-conduct)
- [License](#license)
- [Security](#security)
- [Contributing](#contributing)

## Requirements

- React 16.8.0+
- Node
- NPM

[Back to summary](#summary).

## Installation

```bash
npm install --save --save-exact saint-bernard
```

[Back to summary](#summary).

## Uninstallation

```bash
npm uninstall saint-bernard
```

[Back to summary](#summary).

## Usage

> Note: we recommend using [`zod`](https://www.npmjs.com/package/zod) for correctly checking at runtime the value received from a server.

```tsx
import React, { Fragment, useEffect } from "react"
import { CancelError, useRequest } from "saint-bernard"
import { z } from "zod"

const postsSchema = z.array(z.object({
  body: z.string(),
  id: z.number()
}))

type Posts = z.infer<typeof postsSchema>

export const Main = () => {
  const { data, loading, error, request, cancel } = useRequest<Posts>({
    initialPath: "users/1/posts",
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialQueries: {
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
    },
    initialData: [],
    initialOptions: {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    },
    resolver: async (response) => {
      const posts = await response.json()
      return postsSchema.parse(posts)
    }
  })
  
  useEffect(() => cancel, [cancel])

  if (loading) {
    return (
      <Fragment>
        <p>Loading...</p>
        <button onClick={cancel}>Cancel</button>
      </Fragment>
    )
  }

  if (error) {
    if (error instanceof CancelError)  {
      return (
        <Fragment>
          <h1>Canceled</h1>
          <p>Request has been canceled</p>
          <button onClick={request}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <p>{error.message}</p>
        <button onClick={request}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <button onClick={request}>Fetch posts</button>
      <table>
        <tbody>
          {data.map(article => (
            <tr key={article.id}>
              <td>{article.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  )
}
```

[Back to summary](#summary).

## API

### CancelError

#### Interface

```typescript
export declare class CancelError extends Error {
    constructor(message: string);
}
```

#### Example

```tsx
import React, { Fragment, useEffect } from "react"
import { CancelError, useRequest } from "saint-bernard"
import { z } from "zod"

const usersSchema = z.array(z.object({
  id: z.number()
}))

type Users = z.infer<typeof usersSchema>

export const Main = () => {
  const { error, loading, data, request, cancel } = useRequest<Users>({
    initialPath: "users",
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialQueries: {},
    initialOptions: {},
    initialData: [],
    resolver: async response => {
      const users = await response.json()
      return usersSchema.parse(users)
    } 
  })
  
  useEffect(() => cancel, [cancel]) 
  
  if (loading) {
    return (
      <button onClick={cancel}>Cancel</button>
    )
  }
  
  if (error) {
    if (error instanceof CancelError) {
      return (
        <p>Canceled</p>
      )
    }
    
    return (
      <p>Error</p>
    )
  }
  
  return (
    <button onClick={request}>Request</button>
  )
}
```

### useRequest

#### Interface

```typescript
export interface UseRequestOptions<Data> {
    initialPath: string;
    initialUrl: string;
    initialQueries: Record<string, string>;
    initialData: Data;
    initialOptions: RequestInit;
    resolver: (response: Response) => Promise<Data>;
}

export declare const useRequest: <Data>(options: UseRequestOptions<Data>) => {
    options: RequestInit;
    stringifiedQueries: string;
    queries: Record<string, string>;
    path: string;
    url: string;
    data: Data;
    error: Error | null;
    loading: boolean;
    setQueries: import("react").Dispatch<import("react").SetStateAction<Record<string, string>>>;
    setUrl: import("react").Dispatch<import("react").SetStateAction<string>>;
    setPath: import("react").Dispatch<import("react").SetStateAction<string>>;
    setData: import("react").Dispatch<import("react").SetStateAction<Data>>;
    setError: import("react").Dispatch<import("react").SetStateAction<Error | null>>;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    abortController: AbortController;
    setAbortController: import("react").Dispatch<import("react").SetStateAction<AbortController>>;
    setOptions: import("react").Dispatch<import("react").SetStateAction<RequestInit>>;
    cancel: () => void;
    request: () => void;
};
```

#### Examples

##### options

```tsx
import React, { Fragment, useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { options, setOptions, request } = useRequest<null>({
    initialPath: "users",
    initialUrl: "https://jsonplaceholder.typicode.com/users",
    initialData: null,
    initialQueries: {},
    initialOptions: {
      method: "GET"
    },
    resolver: async response => {
      return null
    }
  })

  const updateOptions = useCallback(() => {
    setOptions(oldOptions => ({
      ...oldOptions,
      headers: {
        "Accept": "application/json"
      }
    }))
  }, [setOptions])

  return (
    <Fragment>
      <p>{JSON.stringify(options)}</p>
      <button onClick={updateOptions}>Update options</button>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

##### queries

```tsx
import React, { Fragment, useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { queries, stringifiedQueries, setQueries, request } = useRequest<null>({
    initialPath: "users",
    initialUrl: "https://jsonplaceholder.typicode.com/users",
    initialData: null,
    initialQueries: {},
    initialOptions: {
      method: "GET"
    },
    resolver: async response => {
      return null
    }
  })

  const queryByName = useCallback(() => {
    setQueries(oldQueries => ({
      ...oldQueries,
      name: "Bret"
    }))
  }, [setQueries])

  const queryLimit = useCallback(() => {
    setQueries(oldQueries => ({
      ...oldQueries,
      limit: "5"
    }))
  }, [setQueries])

  return (
    <Fragment>
      <p>{JSON.stringify(queries)}</p>
      <p>{stringifiedQueries}</p>
      <button onClick={queryByName}>Add name query</button>
      <button onClick={queryLimit}>Limit to 5</button>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

[Back to summary](#summary).

## Code of conduct

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

[Back to summary](#summary).

## License

See [`LICENSE`](./LICENSE).

[Back to summary](#summary).

## Security

See [`SECURITY.md`](./SECURITY.md).

[Back to summary](#summary).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

[Back to summary](#summary).
