# Getting Started

## Requirements

- [Node.js](https://nodejs.org)
- [NPM](https://npmjs.com)
- [TypeScript](https://www.typescriptlang.org/)
- [React 18.0.0+](https://www.npmjs.com/package/react)

## Notes

This library is 100% TypeScript code, so you'll need to use a transpiler to turn the TypeScript code into JavaScript that can be understood by the browser.

We highly recommend you use [Vite.js](https://vitejs.dev/) as your transpiler for building your Web applications using React.

You can also use this library with popular meta-frameworks such as [Next.js](https://nextjs.org/) as well.

We also highly recommend you validate the data you receive from the server by using any data validation library of your choice. We recommend using [Zod.js](https://zod.dev/) for that matter.

## Installation

```bash
npm i saint-bernard
```

## Usage

```tsx
import { ExpectedError, useStatefulRequest, isError, match } from "saint-bernard";
import { useEffect, useCallback } from "react";
import { z } from "zod";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const App = () => {
  const { request, state, loading, cancel } = useStatefulRequest<Users>({
    initialState: [],
    initialLoading: true
  })

  const getUsers = useCallback(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      onResponse: async response => {
        if (!response.ok) {
          return new ExpectedError("Bad response from the server.");
        }

        const json = await response.json();
        const validation = usersSchema.safeParse(json);

        if (!validation.success) {
          return new ExpectedError("Bad data received from the server.");
        }

        return validation.data;
      }
    });
  }, [request]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (loading) {
    return (
      <div>
        <p>Loading</p>
        <button onClick={cancel}>Cancel</button>
      </div>
    );
  }

  if (isError(state)) {
    return match(state, {
      CancelError: () => (
        <div>
          <p>Request has been canceled.</p>
          <button onClick={getUsers}>Try again?</button>
        </div>
      ),
      NetworkError: () => (
        <div>
          <p>A network error occurred, please try again later.</p>
          <button onClick={getUsers}>Try again?</button>
        </div>
      ),
      ExpectedError: error => (
        <div>
          <p>{error.message}</p>
          <button onClick={getUsers}>Try again?</button>
        </div>
      ),
      UnexpectedError: error => (
        <div>
          <p>Unexpected error: {error.message}</p>
          <button onClick={getUsers}>Try again?</button>
        </div>
      )
    });
  }

  return (
    <table>
      <tbody>
        {state.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```