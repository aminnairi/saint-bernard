# useStatelessRequest

The `useStatelessRequest` is a React hook that let's you configure an HTTP request that does not have data to display.

## Usage

```typescript
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  useStatelessRequest<Users>();

  return (
    <p>Data received.</p>
  );
};
```

## initialLoading

Sometimes, it is useful to start right away with a loading state that is `true`. By default, whenever running the `request` function, the `loading` state is set to `true`, and whenever the response from the server is received, it is set to `false`. However, the initial loading state is always set to `false`, unless you configure this property to be `true`.

```typescript
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  useStatelessRequest({
    initialLoading: true // [!code focus]
  })

  return (
    <p>Data received.</p>
  );
};
```

## loading

If you want to know when your request is running, and when it is not (meaning, the browser has received and decoded the request from the server), you can use the `loading` state that is returned from the `useStatelessRequest` hook.

```typescript
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  const {
    loading // [!code focus]
  } = useStatelessRequest<Users>();

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
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  const {
    setLoading // [!code focus]
  } = useStatelessRequest<Users>();

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

Canceling a request can be useful, especially when some request takes a long time, letting the user being able to cancel a request, or change his mind, is a great value added to the user experience. You can extract the `cancel` function from the `useStatelessRequest` hook and use it as a listener for your HTML elements.

```typescript
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  const {
    cancel // [!code focus]
  } = useStatelessRequest<Users>();

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
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  const {
    abortControllerRef // [!code focus]
  } = useStatelessRequest<Users>();

  useEffect(() => {
    abortControllerRef.current = new AbortController(); // [!code focus]
  }, []);

  return (
    <p>Received data.</p>
  );
};
```

## request

This is the function that allow you to send the request. By default, when called, the `useStatelessRequest` will not trigger any HTTP request until this function gets called. You can use any HTTP client of your choice, or even use a fake HTTP call to mock your API endpoints as long as you return either a `State` or an `ExpectedError`.

```typescript
import { useEffect, useCallback } from "react";
import { ExpectedError, useStatelessRequest, GET } from "saint-bernard";
import { z } from "zod";

const usersSchema = z.array(z.object({
  id: z.number()
}));

type Users = z.infer<typeof usersSchema>;

const App = () => {
  const {
    request // [!code focus]
  } = useStatelessRequest<Users>();

  const getUsers = useCallback(() => {
    request(async ({ signal }) => { // [!code focus:12]
      const response = await GET
      .withUrl("https://jsonplaceholder.typicode.com/users")
      .withHeader("Content-Type", "application/json")
      .withSignal(signal)
      .send();

      if (!response.ok) {
        return new ExpectedError("Bad response from the server.");
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

The state represent only the errors as a union of all possible errors in the case of using the `useStatelessRequest` hook as opposed to the `useStatefulRequest`. 

Several functions help you discriminate the errors, and although they are not mandatory, we recommend you to use them in order to enhance your developer experience.

```typescript
import { ExpectedError, useStatelessRequest, isError, match } from "saint-bernard";
import { z } from "zod";

const App = () => {
  const {
    state // [!code focus]
  } = useStatelessRequest<Users>();

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
    <p>Received data.</p> // [!code focus]
  );
};
```

## reset

Sometimes, it can be great to offer an alternative to retrying to run a request, instead it could be great to simply cancel everything and reset the state.

For that matter, you can use the `reset` function. It essentially reset the state to its initial state, provided when creating the request.

```typescript
import { useStatelessRequest } from "saint-bernard";

const App = () => {
  const {
    reset // [!code focus]
  } = useStatelessRequest<Users>({
    initialState: []
  });

  return (
    <button onClick={reset}>Reset</button> // [!code focus]
  );
};
```