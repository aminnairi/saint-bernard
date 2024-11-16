# Reusable HTTP settings

Being able to reuse HTTP requests settings is a necessary when the application grows in size and complexity.

For instance, it would be great to prevent repeating the same URL for the same requests, or even the same authorization header.

```typescript
import { GET } from "saint-bernard";

const token = "eyJhbGciOiJIUzI1NiIsInR...";

export const getUsersRequest = GET("https://jsonplaceholder.typicode.com/users");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)

export const getPostsRequest = GET("https://jsonplaceholder.typicode.com/posts");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)
  
export const getPhotosRequest = GET("https://jsonplaceholder.typicode.com/photos");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)
```

## withMethod & withUri

For that, you can use the `withUrl` method along side with the `withUri` method in order to factorize the above code.

```typescript
import { GET } from "saint-bernard";

const token = "eyJhbGciOiJIUzI1NiIsInR...";

const fromJsonplaceholder = GET("https://jsonplaceholder.typicode.com");

export const getUsersRequest = fromJsonplacehoder
  .withUri("/users");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)

export const getPostsRequest = fromJsonplaceholder
  .withUri("/posts");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)
  
export const getPhotosRequest = fromJsonplaceholder
  .withUri("/photos");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)
```

Now, if you need to update the URL, you only need to do it in one place.

```typescript
import { GET } from "saint-bernard";

const token = "eyJhbGciOiJIUzI1NiIsInR...";

const fromJsonplaceholder = GET("https://api.domain.com");

export const getUsersRequest = fromJsonplacehoder
  .withUri("/users");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)

export const getPostsRequest = fromJsonplaceholder
  .withUri("/posts");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)
  
export const getPhotosRequest = fromJsonplaceholder
  .withUri("/photos");
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`)
```

## Reuse settings

In fact, what we did earlier is a very simple version of what we can do, thanks to the step builder pattern used for writing these helper function.

We can reuse pretty much anything we want and build our own set of reusable request options.

Let's do that for the `Accept` and `Authorization` headers as well.

```typescript
import { GET } from "saint-bernard";

const token = "eyJhbGciOiJIUzI1NiIsInR...";

const fromJsonplaceholder = GET("https://api.domain.com")
  .withHeader("Accept", "application/json")
  .withHeader("Authorization", `Bearer ${token}`);

export const getUsersRequest = fromJsonplacehoder.withUri("/users");

export const getPostsRequest = fromJsonplaceholder.withUri("/posts");
  
export const getPhotosRequest = fromJsonplaceholder.withUri("/photos");
```

## Working with different HTTP methods

If you need to create several functions for sending data for the same server, with different HTTP methods, it can be quite tedious to have to repeat ourselves multiple times for the same information such as below.

```typescript
import { GET, POST, PATCH, DELETE } from "saint-bernard";

const token = "eyJhbGciOiJIUzI1NiIsInR...";

export const getUsersRequest = GET("https://jsonplaceholder.typicode.com/users")
  .withHeader("Authorization", `Bearer ${token}`)
  .withHeader("Accept", "application/json");

export const createUserRequest = POST("https://jsonplaceholder.typicode.com/users")
  .withHeader("Authorization", `Bearer ${token}`)
  .withHeader("Accept", "application/json")
  .withHeader("Content-Type", "application/json");

export const updateUserRequest = PATCH("https://jsonplaceholder.typicode.com/users")
  .withHeader("Authorization", `Bearer ${token}`)
  .withHeader("Accept", "application/json")
  .withHeader("Content-Type", "application/json");

export const removeUserRequest = DELETE("https://jsonplaceholder.typicode.com/users")
  .withHeader("Authorization", `Bearer ${token}`)
  .withHeader("Accept", "application/json");
```

In that particular case, you'll have to reach out for the `httpRequest` more low-level API in order to prevent repetition and reuse most of the parameters.

```typescript
import { httpRequest } from "saint-bernard";

const token = "eyJhbGciOiJIUzI1NiIsInR...";

export const baseRequest = httpRequest()
  .withUrl("https://jsonplaceholder.typicode.com/users")
  .withHeader("Authorization", `Bearer ${token}`)
  .withHeader("Accept", "application/json");

export const getUsersRequest = baseRequest.withmethod("GET");

export const createUserRequest = baseRequest.withMethod("POST");

export const updateUserRequest = baseRequest.withMethod("PATCH");

export const removeUserRequest = baseRequest.withMethod("DELETE");
```

## Using a React hook for better reusability

You can even go one step further and use a React hook to combine what we have seen earlier.

```typescript
import { httpRequest } from "saint-bernard";
import { useMemo } from "react";

export const useBaseRequest = () => {
  const token = useMemo(() => "eyJhbGciOiJIUzI1NiIsInR...", []);

  const baseRequest = useMemo(() => {
    return httpRequest()
      .withUrl("https://jsonplaceholder.typicode.com")
      .withHeader("Authorization", `Bearer ${token}`)
      .withHeader("Accept", "application/json");
  }, [token]);

  return {
    token,
    baseRequest
  };
};
```

```typescript
import { useMemo, useCallback } from "react";
import { useBaseRequest } from "@yourcompany/yourapp/hooks/base-request";

export const useUsersRequests = () => {
  const { baseRequest } = useBaseRequest();

  const getUsersRequest = useMemo(() => {
    return baseRequest
      .withmethod("GET")
      .withUri("/users");
  }, [baseRequest]);

  const createUserRequest = useMemo(() => {
    return baseRequest
      .withMethod("POST")
      .withUri("/users");
  }, [baseRequest]);

  const updateUserRequest = useCallback((id: string) => {
    return baseRequest
      .withMethod("PATCH")
      .withUri(`/users/${id}`);
  }, [baseRequest]);

  const removeUserRequest = useCallback((id: string) => {
    return baseRequest
      .withMethod("DELETE")
      .withUri(`/users/${id}`);
  }, [baseRequest]);

  return {
    getUsersRequest,
    createUserRequest,
    updateUserRequest,
    removeUserRequest
  };
};
```

```typescript
import { useMemo, useCallback } from "react";
import { useBaseRequest } from "@yourcompany/yourapp/hooks/base-request";

export const usePostsRequests = () => {
  const { baseRequest } = useBaseRequest();

  const getPostsRequest = useMemo(() => {
    return baseRequest
      .withmethod("GET")
      .withUri("/posts");
  }, [baseRequest]);

  const createPostRequest = useMemo(() => {
    return baseRequest
      .withMethod("POST")
      .withUri("/users");
  }, [baseRequest]);

  const updatePostRequest = useCallback((id: string) => {
    return baseRequest
      .withMethod("PATCH")
      .withUri(`/users/${id}`);
  }, [baseRequest]);

  const removePostRequest = useCallback((id: string) => {
    return baseRequest
      .withMethod("DELETE")
      .withUri(`/users/${id}`);
  }, [baseRequest]);

  return {
    getPostsRequest,
    createPostRequest,
    updatePostRequest,
    removePostRequest
  };
};
```

```typescript
import { ExpectedError, useStatelessRequest } from "saint-bernard";
import { useUsersRequests } from "@yourcompany/yourapp/hooks/users-requests";

export const Main = () => {
  const { request } = useStatelessRequest();
  const { createUserRequest } = useUsersRequests();

  const createUser = useCallback(() => {
    request(async ({ signal }) => {
      const response = await createUserRequest
        .withBody(JSON.stringify({ username: "johndoe" }))
        .withSignal(signal)
        .send();

      if (!response.ok) {
        return new ExpectedError("Bad response from the server.");
      }
    });
  }, [request]);

  //...
};
```