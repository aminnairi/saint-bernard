# saint-bernard

React Hook for requesting data using the Web API Fetch written in TypeScript

[![NPM](https://badgen.net/npm/v/saint-bernard)](https://www.npmjs.com/package/saint-bernard) [![Coverage Status](https://coveralls.io/repos/github/aminnairi/saint-bernard/badge.svg?branch=production)](https://coveralls.io/github/aminnairi/saint-bernard?branch=production) ![Vulnerabilities](https://badgen.net/snyk/aminnairi/saint-bernard) [![Size](https://badgen.net/bundlephobia/minzip/saint-bernard)](https://bundlephobia.com/package/saint-bernard@latest) [![Types](https://badgen.net/npm/types/saint-bernard)](https://github.com/aminnairi/saint-bernard)

## Summary

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Uninstallation](#uninstallation)
- [Usage](#usage)
- [API](#api)
  - [CancelError](#cancelerror)
    - [Interface](#interface)
    - [Example](#example)
  - [useRequest](#userequest)
    - [Interface](#interface-1)
    - [Examples](#examples)
      - [request](#request)
      - [cancel](#cancel)
      - [options](#options)
      - [queries](#queries)
      - [path](#path)
      - [url](#url)
      - [data](#data)
      - [error](#error)
      - [loading](#loading)
      - [abortControler](#abortcontroler)
- [Changelog](#changelog)
- [Code of conduct](#code-of-conduct)
- [License](#license)
- [Security](#security)
- [Contributing](#contributing)

## Features

- Close to the metal, configurable yet high-level enough to help you do more with less
- Tested to cover 100% of the source-code published
- Zero-dependencies
- Lightweight
- Written in TypeScript from the ground up
- Strict semantic versionning for the releases
- Best when used with [`zod`](https://www.npmjs.com/package/zod)
- Leveraging the [Web API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Full control over the options, url, path & query parameters
- Ability to cancel requests at any time
- Written to fully work with modern React Hooks and functional components

[Back to summary](#summary).

## Requirements

- [React 16.8.0+](https://www.npmjs.com/package/react)
- [Node](https://nodejs.org)
- [NPM](https://www.npmjs.com/)

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

[Back to summary](#summary).

### CancelError

[Back to summary](#summary).

#### Interface

```typescript
export declare class CancelError extends Error {
    constructor(message: string);
}
```

[Back to summary](#summary).

#### Example

```tsx
import React, { useEffect } from "react"
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

[Back to summary](#summary).

### useRequest

[Back to summary](#summary).

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

[Back to summary](#summary).

#### Examples

[Back to summary](#summary).

##### request

```tsx
import React from "react"
import { CancelError, useRequest } from "saint-bernard"

export const Page = () => {
  const { request } = useRequest<null>({
    initialPath: "users",
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => null
  })

  return (
    <button onClick={request}>Request</button>
  )
}
```

[Back to summary](#summary).

##### cancel

```tsx
import React, { Fragment, useEffect } from "react"
import { CancelError, useRequest } from "saint-bernard"

export const Page = () => {
  const { loading, error, request, cancel } = useRequest<null>({
    initialPath: "",
    initialUrl: "",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => null
  })
  
  useEffect(() => cancel, [cancel])

  if (loading) {
    return (
      <Fragment>
        <h1>Loading</h1>
        <button onClick={cancel}>Cancel</button>
      </Fragment>
    )
  }

  if (error) {
    if (error instanceof CancelError) {
      return (
        <Fragment>
          <h1>Canceled</h1>
          <button onClick={request}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <button onClick={request}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

[Back to summary](#summary).

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

[Back to summary](#summary).

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
    initialOptions: {},
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

[Back to summary](#summary).

##### path

```tsx
import React, { Fragment, useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { path, setPath, request } = useRequest<null>({
    initialPath: "users",
    initialUrl: "https://jsonplaceholder.typicode.com/users",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => {
      return null
    }
  })

  const updatePath = useCallback(() => {
    setPath("posts")
  }, [setPath])

  return (
    <Fragment>
      <p>{path}</p>
      <button onClick={updatePath}>Update path</button>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

[Back to summary](#summary).

##### url

```tsx
import React, { Fragment, useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { url, setUrl, request } = useRequest<null>({
    initialPath: "",
    initialUrl: "https://jsonplaceholder.typicode.com/users",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => {
      return null
    }
  })

  const updateUrl = useCallback(() => {
    setUrl("https://ipapi.co/json")
  }, [setUrl])

  return (
    <Fragment>
      <p>{url}</p>
      <button onClick={updateUrl}>Update URL</button>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

[Back to summary](#summary).

##### data

```tsx
import React, { Fragment, useCallback } from "react"
import { z } from "zod"
import { useRequest } from "saint-bernard"

const usersSchema = z.array(z.object({
  id: z.number()
}))

type Users = z.infer<typeof usersSchema>

export const Page = () => {
  const { data, setData, request } = useRequest<Users>({
    initialPath: "users",
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialData: [],
    initialQueries: {},
    initialOptions: {},
    resolver: async response => {
      const users = await response.json()
      return usersSchema.parse(users)
    }
  })

  const reset = useCallback(() => {
    setData([])
  }, [setData])

  return (
    <Fragment>
      <p>{JSON.stringify(data)}</p>
      <button onClick={reset}>Reset</button>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

[Back to summary](#summary).

##### error

```tsx
import React, { Fragment, useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { error, setError, request } = useRequest<null>({
    initialPath: "",
    initialUrl: "",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => {
      throw new Error("error")
    }
  })

  const reset = useCallback(() => {
    setError(null)
  }, [setError])

  if (error) {
    return (
      <Fragment>
        <h1>Error</h1>
        <button onClick={reset}>Reset</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <button onClick={request}>Request</button>
    </Fragment>
  )
}
```

[Back to summary](#summary).

##### loading

```tsx
import React, { useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { loading, setLoading } = useRequest<null>({
    initialPath: "",
    initialUrl: "",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => null
  })

  const load = useCallback(() => {
    setLoading(true)
  }, [setLoading])

  const unload = useCallback(() => {
    setLoading(false)
  }, [setLoading])

  if (loading) {
    return (
      <button onClick={unload}>Stop loading</button>
    )
  }

  return (
    <button onClick={load}>Load</button>
  )
}
```

[Back to summary](#summary).

##### abortControler

```tsx
import React, { Fragment, useCallback } from "react"
import { useRequest } from "saint-bernard"

export const Page = () => {
  const { abortController, setAbortController } = useRequest<null>({
    initialPath: "",
    initialUrl: "",
    initialData: null,
    initialQueries: {},
    initialOptions: {},
    resolver: async response => null
  })

  const updateAbortController = useCallback(() => {
    setAbortController(new AbortController())
  }, [setAbortController])

  return (
    <Fragment>
      <p>{JSON.stringify(abortController)}</p>
      <button onClick={updateAbortController}>Change abort controller</button>
    </Fragment>
  )
}
```

[Back to summary](#summary).

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
