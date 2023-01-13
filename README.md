# saint-bernard

React Hook for requesting data using the Web API Fetch written in TypeScript

## Requirements

- React 16.8.0+
- Node
- NPM

## Installation

```bash
npm install --save --save-exact saint-bernard
```

## Uninstallation

```bash
npm uninstall saint-bernard
```

## Usage

```jsx
import React, { Fragment, useCallback, useEffect } from "react"
import { CancelError, useRequest } from "react-request"
import { z } from "zod"

const usersSchema = z.array(z.object({
  body: z.string(),
  id: z.number()
}))

type Users = z.infer<typeof usersSchema>

export const Main = () => {
  const { data, loading, error, request, cancel } = useRequest<Users>({
    initialPath: "users/1/posts",
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialQueries: {
      id: "2"
    },
    initialData: [],
    initialOptions: {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    },
    resolver: async (response) => {
      const users = await response.json()
      return usersSchema.parse(users)
    }
  })

  const fetchUsers = useCallback(() => {
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
      <button onClick={fetchUsers}>Fetch users</button>
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
