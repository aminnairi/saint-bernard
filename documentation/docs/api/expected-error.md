# ExpectedError

The `ExpectedError` class is a container for an error that is expected from your application logic. For instance, it could be that the response from the server indicates that the user has not paid his bill for this month, or that a validation has failed for the email field, and so on.

This is different from a technical error, for instance the network being down, the server not responding properly, or the request being canceled.

You typically use this class when returning anything that is an error inside the `onResponse` method from the `useStatefulRequest` or `useStatelessRequest` hooks.

## Usage

```typescript
import { ExpectedError, useStatelessRequest, isError, match, POST } from "saint-bernard";
import { useEffect } from "react";

const Main = () => {
  const {
    request,
    state
  } = useStatelessRequest();

  useEffect(() => {
    request(async ({ signal }) => {
      const response = await POST("https://jsonplaceholder.typicode.com/users")
        .withSignal(signal)
        .withHeader("Content-Type", "application/json")
        .withBody(JSON.stringify({ username: "johndoe" }))
        .send();

      if (!response.ok) {
        if (response.status === 401) {
          return new ExpectedError("You don't have the permissions to create a user."); // [!code focus]
        }

        if (response.status === 429) {
          return new ExpectedError("You can't send that much request."); // [!code focus]
        }

        return new ExpectedError("An error occurred, please try again later."); // [!code focus]
      }
    });
  }, [request]);

  if (isError(state)) {
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
    <p>User created!</p>
  );
};
```

Note that this also work when using the `useStatefulRequest` hook.

```typescript
import { ExpectedError, useStatefulRequest, isError, match, POST } from "saint-bernard";
import { useEffect } from "react";

const Main = () => {
  const {
    request,
    state
  } = useStatelessRequest<void>(); // [!code focus]

  useEffect(() => {
    request(async ({ signal }) => {
      const response = await POST("https://jsonplaceholder.typicode.com/users")
        .withSignal(signal)
        .withBody(JSON.stringify({ username: "johndoe" }))
        .withHeader("Content-Type", "application/json");

      if (!response.ok) {
        if (response.status === 401) {
          return new ExpectedError("You don't have the permissions to create a user."); // [!code focus]
        }

        if (response.status === 429) {
          return new ExpectedError("You can't send that much request."); // [!code focus]
        }

        return new ExpectedError("An error occurred, please try again later."); // [!code focus]
      }
    });
  }, [request]);

  if (isError(state)) {
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
    <p>User created!</p>
  );
};
```