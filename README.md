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
import React, { Fragment, useCallback, useEffect } from "react"
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

  const fetchPosts = useCallback(() => {
    request()
  }, [request])

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
      <button onClick={fetchPosts}>Fetch posts</button>
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
