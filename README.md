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
  - [useRequest](#userequest)
    - [request](#request)
      - [state](#state)
      - [setState](#setstate)
      - [loading](#loading)
      - [setLoading](#setloading)
      - [error](#error)
      - [setError](#seterror)
      - [abortController](#abortcontroller)
      - [setAbortController](#setabortcontroller)
      - [cancel](#cancel)
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

```typescript
import React, { Fragment, useEffect } from "react"
import { CancelError, useRequest } from "saint-bernard"
import { z } from "zod"

const postsSchema = z.array(z.object({
  body: z.string(),
  id: z.number()
}))

type Posts = z.infer<typeof postsSchema>

export const Main = () => {
  const { state, loading, error, request, cancel } = useRequest<Posts>({
    initialState: []
  })

  const requestUsers = useCallback(() => {
    request({
      url: "https://jsonplaceholder.tyipcode.com/users",
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      onResponse: async response => {
        const json = await response.json();
        return json;
      }
    })
  }, []);
  
  useEffect(() => {
    requestUsers();

    return () => {
      cancel();
    };
  }, [])

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
          <button onClick={requestUsers}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <p>{error.message}</p>
        <button onClick={requestUsers}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <button onClick={requestUsers}>Refresh</button>
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

### useRequest

```typescript
export interface UseRequestOptions<State> {
  initialState?: State;
}
```

```typescript
import React from "react";
import { useRequest, UseRequestOptions } from "saint-bernard";

interface User {
  id: number;
}

const options: UseRequestOptions<Array<User>> = {
  initialState: []
};

export const Main = () => {
  useRequest<Array<User>>(options);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

#### request

```typescript
export interface RequestOptions<State> extends RequestInit {
  url: URL | RequestInfo,
  onResponse?: (response: Response) => Promise<State>;
}
```

```typescript
import React, { useEffect } from "react";
import { useRequest, RequestOptions } from "saint-bernard";

interface User {
  id: number;
}

const options: RequestOptions = {
  url: "https://jsonplaceholder.typicode.com/users",
  method: "GET",
  mode: "cors",
  headers: {
    Accept: "application/json"
  }
}

export const Main = () => {
  const { request } = useRequest<Array<User>>({
    initialState: []
  });

  useEffect(() => {
    request({
      ...options,
      onResponse: async response => {
        const users = await response.json();
        return users;
      }
    });
  }, []);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### state

```typescript
import React from "react";
import { useRequest } from "saint-bernard";

interface User {
  id: number;
}

export const Main = () => {
  const { state } = useRequest<Array<User>>();

  return (
    <div>
      {JSON.stringify(state)}
    </div>
  );
}
```

##### setState

```typescript
import React, { useEffect } from "react";
import { useRequest } from "saint-bernard";

interface User {
  id: number;
}

export const Main = () => {
  const { setState } = useRequest<Array<User>>({
    initialState: []
  });

  useEffect(() => {
    setState([]);
  }, []);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### loading

```typescript
import React from "react";
import { useRequest } from "saint-bernard";

export const Main = () => {
  const { loading } = useRequest();

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### setLoading

```typescript
import React, { useEffect } from "react";
import { useRequest } from "saint-bernard";

export const Main = () => {
  const { setLoading } = useRequest();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### error

```typescript
import React from "react";
import { useRequest } from "saint-bernard";

export const Main = () => {
  const { error } = useRequest();

  if (error) {
    return (
      <div>
        {error.message}
      </div>
    );
  }

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### setError

```typescript
import React, { useEffect } from "react";
import { useRequest } from "saint-bernard";

export const Main = () => {
  const { setError } = useRequest();

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### abortController

```typescript
import React, { useEffect } from "react";
import { useRequest } from "saint-bernard";

export const Main = () => {
  const { abortController } = useRequest();

  useEffect(() => {
    setTimeout(() => {
      abortController.abort();
    }, 5000);
  }, []);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### setAbortController

```typescript
import React, { useEffect, useMemo } from "react";
import { useRequest } from "saint-bernard";

export const Main = () => {
  const abortController = useMemo(() => new AbortController(), []);

  const { setAbortController } = useRequest();

  useEffect(() => {
    setAbortController(new AbortController());

    setTimeout(() => {
      abortController.abort();
    }, 5000);
  }, []);

  return (
    <div>
      Saint-Bernard
    </div>
  );
}
```

##### cancel

```typescript
import React, { useEffect } from "react";
import { useRequest, CancelError } from "saint-bernard";

export const Main = () => {
  const { cancel, error } = useRequest();

  useEffect(() => {
    setTimeout(() => {
      cancel();
    }, 5000);
  }, []);

  if (error) {
    if (error instanceof CancelError) {
      return (
        <div>Request cancelled</div>
      );
    }

    return (
      <div>Request failed because {error.message}</div>
    );
  }

  return (
    <div>
      Saint-Bernard
    </div>
  );
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
