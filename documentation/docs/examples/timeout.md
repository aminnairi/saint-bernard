# Timeout

Creating a request that can timeout can be useful in order to prevent taking too much network resources for a long period of time.

You can use a simple combination of `useEffect`, `setTimeout` and this library in order to create a request that can timeout.

Whenever the request times out, a `CancelError` will be triggered.

## Source-code

```typescript
import { useEffect, useCallback } from "react";
import { ExpectedError, useStatefulRequest, isError, match } from "saint-bernard";
import { z } from "zod";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const Main = () => {
  const {
    state,
    request,
    loading,
    cancel
  } = useStatefulRequest<Users>({
    initialState: [],
    initialLoading: true
  });

  const getUsers = useCallback(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      onResponse: async response => {
        if (!response.ok) {
          return new ExpectedError("Bad response from the server.");
        }

        const json = await response.json();
        const validation = usersSchema.safeParse(json);

        if (!validation.success) {
          return new ExpectedError("Malformed response from the server.");
        }

        return validation.data;
      }
    });
  }, [request]);

  useEffect(() => {
    getUsers();

    const timeoutIdentifier = setTimeout(() => {
      cancel();
    }, 10_000);

    return () => {
      clearTimeout(timeoutIdentifier);
    };
  }, [getUsers]);

  if (isError(state)) {
    return match(state, {
      NetworkError: () => (
        <p>There has been a network error</p>
      ),
      CancelError: () => (
        <p>The request has been canceled or timeout.</p>
      ),
      UnexpectedError: error => (
        <p>An unexpected error occurred: {error.message}.</p>
      ),
      ExpectedError: error => (
        <p>Error: {error.message}.</p>
      )
    });
  }

  return (
    <p>There is {state.length} users.</p>
  );
};
```

The important bit of code to focus on is the following as the rest of the source-code is pretty similar from what you can expect to see in this documentation.

```typescript
import { useEffect, useCallback } from "react";
import { ExpectedError, useStatefulRequest, isError, match } from "saint-bernard";
import { z } from "zod";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const Main = () => {
  const {
    state,
    request,
    loading,
    cancel
  } = useStatefulRequest<Users>({
    initialState: [],
    initialLoading: true
  });

  const getUsers = useCallback(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      onResponse: async response => {
        if (!response.ok) {
          return new ExpectedError("Bad response from the server.");
        }

        const json = await response.json();
        const validation = usersSchema.safeParse(json);

        if (!validation.success) {
          return new ExpectedError("Malformed response from the server.");
        }

        return validation.data;
      }
    });
  }, [request]);

  useEffect(() => {
    getUsers();

    const timeoutIdentifier = setTimeout(() => { // [!code focus:7]
      cancel();
    }, 10_000);

    return () => {
      clearTimeout(timeoutIdentifier);
    };
  }, [getUsers]);

  if (isError(state)) {
    return match(state, {
      NetworkError: () => (
        <p>There has been a network error</p>
      ),
      CancelError: () => (
        <p>The request has been canceled or timeout.</p>
      ),
      UnexpectedError: error => (
        <p>An unexpected error occurred: {error.message}.</p>
      ),
      ExpectedError: error => (
        <p>Error: {error.message}.</p>
      )
    });
  }

  return (
    <p>There is {state.length} users.</p>
  );
};
```

In this example, we used a 10 second timeout, represented by `10_000` (in milliseconds).

Do not forget to clear the timeout identifier by using the `useEffect` cleanup callback function, as this can cause unecessary request cancelation since this library already cancels the request on component destruction!

Once this code executes, whenever the timeout has reached, the `CancelError` will be triggered, this is where you can show your user a useful message in case the request has timeout or has been canceled.

```typescript
import { useEffect, useCallback } from "react";
import { ExpectedError, useStatefulRequest, isError, match } from "saint-bernard";
import { z } from "zod";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const Main = () => {
  const {
    state,
    request,
    loading,
    cancel
  } = useStatefulRequest<Users>({
    initialState: [],
    initialLoading: true
  });

  const getUsers = useCallback(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      onResponse: async response => {
        if (!response.ok) {
          return new ExpectedError("Bad response from the server.");
        }

        const json = await response.json();
        const validation = usersSchema.safeParse(json);

        if (!validation.success) {
          return new ExpectedError("Malformed response from the server.");
        }

        return validation.data;
      }
    });
  }, [request]);

  useEffect(() => {
    getUsers();

    const timeoutIdentifier = setTimeout(() => {
      cancel();
    }, 10_000);

    return () => {
      clearTimeout(timeoutIdentifier);
    };
  }, [getUsers]);

  if (isError(state)) {
    return match(state, {
      NetworkError: () => (
        <p>There has been a network error</p>
      ),
      CancelError: () => ( // [!code focus:3]
        <p>The request has been canceled or timeout.</p>
      ),
      UnexpectedError: error => (
        <p>An unexpected error occurred: {error.message}.</p>
      ),
      ExpectedError: error => (
        <p>Error: {error.message}.</p>
      )
    });
  }

  return (
    <p>There is {state.length} users.</p>
  );
};
```