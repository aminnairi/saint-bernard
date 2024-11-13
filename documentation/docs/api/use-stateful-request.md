# useStatefulRequest

The `useStatefulRequest` is a React hook that let's you configure an HTTP request.

## Usage

```typescript
import { useStatefulRequest } from "saint-bernard";

const App = () => {
  useStatefulRequest<Users>({
    initialState: []
  })

  return (
    <p>Data received.</p>
  );
};
```

## initialLoading

Sometimes, it is useful to start right away with a loading state that is `true`. By default, whenever running the `request` function, the `loading` state is set to `true`, and whenever the response from the server is received, it is set to `false`. However, the initial loading state is always set to `false`, unless you configure this property to be `true`.

```typescript
import { useStatefulRequest } from "saint-bernard";

const App = () => {
  useStatefulRequest<Users>({
    initialState: [],
    initialLoading: true // [!code focus]
  })

  return (
    <p>Data received.</p>
  );
};
```

## loading

If you want to know when your request is running, and when it is not (meaning, the browser has received and decoded the request from the server), you can use the `loading` state that is returned from the `useStatefulRequest` hook.

```typescript
import { useStatefulRequest } from "saint-bernard";

const App = () => {
  const {
    loading // [!code focus]
  } = useStatefulRequest<Users>({
    initialState: []
  })

  if (loading) { // [!code focus]
    return (
      <p>Please wait while we are fetching your data...</p>
    );
  }

  return (
    <p>Data received.</p>
  );
};
```

## setLoading

If for any reason you need to manually set the loading state yourself, you can use the `setLoading` setter which is a simple `Dispatch<SetStateAction<boolean>>` behind the scene (which is a `useState` setter).

```typescript
import { useStatefulRequest } from "saint-bernard";

const App = () => {
  const {
    setLoading // [!code focus]
  } = useStatefulRequest<Users>({
    initialState: []
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // [!code focus]
    }, 10_000);
  }, [setLoading]); // [!code focus]

  return (
    <p>Data received.</p>
  );
};
```

::: info
The `setLoading` function has a stable reference since it uses the `useCallback` hook internally, some linter like `eslint` might force you to add this function as the dependency of your `useCallback` or `useEffect`, it won't affect performance since your hooks won't run again thanks to this stable reference.
:::

## cancel

Canceling a request can be useful, especially when some request takes a long time, letting the user being able to cancel a request, or change his mind, is a great value added to the user experience. You can extract the `cancel` function from the `useStatefulRequest` hook and use it as a listener for your HTML elements.

```typescript
import { useStatefulRequest } from "saint-bernard";

const App = () => {
  const {
    cancel // [!code focus]
  } = useStatefulRequest<Users>({
    initialState: []
  })

  return (
    <button onClick={cancel}> // [!code focus]
      Cancel the request
    </button>
  );
};
```

## abortControllerRef

Behind the scene, the `cancel` function simply calls the `abortControllerRef.current.abort()` method on the `AbortController` class that is stored as a `MutableRefObject`. You can use it, reassign it if you want. We don't recommend using it directly since this is used internally by this library to cancel properly your requests.

```typescript
import { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

const App = () => {
  const {
    abortControllerRef // [!code focus]
  } = useStatefulRequest<Users>({
    initialState: []
  });

  useEffect(() => {
    abortControllerRef.current = new AbortController(); // [!code focus]
  }, []);

  return (
    <p>Received data.</p>
  );
};
```

## request

This is the function that allow you to send the request. By default, when called, the `useStatefulRequest` will not trigger any HTTP request until this function gets called. You can define any options from the Fetch Web API, except the `signal` one (this is using the `RequestInit` type internally).

```typescript
import { useEffect, useCallback } from "react";
import { ExpectedError, useStatefulRequest } from "saint-bernard";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const App = () => {
  const {
    request // [!code focus]
  } = useStatefulRequest<Users>({
    initialState: []
  });

  const getUsers = useCallback(() => {
    request({ // [!code focus:22]
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
  }, [getUsers]);

  return (
    <p>Received data.</p>
  );
};
```

## state

The state represent both the data and the errors as a union of all possible cases and takes the type that has been provided as a generic argument in order to reflect the correct union of all possible types. 

This has been done in order to prevent impossible states to be possible, like displaying the state while the data hasn't arrived yet, or displaying the state while there is an error.

Several functions help you discriminate the data from the errors, and although they are not mandatory, we recommend you to use them in order to enhance your developer experience.

```typescript
import { ExpectedError, useStatefulRequest, isError, match } from "saint-bernard";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const App = () => {
  const {
    state // [!code focus]
  } = useStatefulRequest<Users>({
    initialState: []
  });

  if (isError(state)) { // [!code focus:16]
    return match(state, {
      NetworkError: () => (
        <p>There has been a network error</p>
      ),
      CancelError: () => (
        <p>The request has been canceled.</p>
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
    <p>There is {state.length} users.</p> // [!code focus]
  );
};
```