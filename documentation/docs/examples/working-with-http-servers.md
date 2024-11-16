# Working with HTTP servers

React.js is often used as a client library for consumming HTTP and WebSocket APIs from a server, often written in Node.js, but can work with any language communicating with the HTTP and WebSocket protocol.

We will focus on HTTP servers, especially written using the JavaScript language.

## Schema validation

As explained in the [Getting Started](../introduction/getting-started.md) page, validating data is a best practice, especially when using TypeScript since it is never 100% sure that you'll receive the correct & expected shape for your data.

Except, when working with a server, which is written in the same language (TypeScript), it can be cumbersome to have a schema that represent the response in the client source-code, as well as data-transfer objects that are stored on the server.

This is why validation libraries like Zod.js are useful in these kind of situation to help minimizing the amount of work necessary to share data between servers and clients.

## Isomorphic schema validation

Let's say that we have a Nest.js HTTP server that exposed a route that returns a list of users.

```typescript
import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get()
  public getUsers() {
    return this.userService.getUsers();
  }
}
```

If the data returned by the server have the following shape.

```typescript
interface User {
  id: number,
  email: string
}
```

There is nothing stopping us from defining a schema from the client-side of our source-code that defines a user with the following schema.

```typescript
import { z } from "zod";

export const usersSchema = z.array(z.object({
  id: z.string().uuid(),
  email: z.string().email()
}));
```

Of course, the next thing we know is that this will fail and we will have to display an error message in the user interface.

In order to prevent these kind of silly mistakes of de-synchronization of schemas between the server and the client, we can enforce a schema, whether it is the one defined in the client, or on the server.

```typescript
import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { z } from "zod";

export const usersSchema = z.array(z.object({ // [!code focus:4]
  id: z.number(),
  email: z.string().email()
}));

export type Users = z.infer<typeof usersSchema>; // [!code focus]

@Controller("users")
class UserController {
  public constructor(private readonly userService: UserService): Promise<Users> {} // [!code focus]

  @Get()
  public getUsers() {
    return this.userService.getUsers();
  }
}
```

The important part in this code is that we created the schema on the server-side, plus, we enforced the schema on the route response. This way, we can easily use this schema on the client side to validate the data, but more: ensure that the TypeScript type is identical.

```typescript
import { useEffect } from "react";
import { ExpectedError, useStatefulRequest, isError, match } from "saint-bernard";
import { User, usersSchema } from "@app/server/src/user/user.controller";

const Main = () => {
  const { request, state, loading } = useStatefulRequest<Users>({
    intitialState: []
  });

  useEffect(() => {
    request({
      url: "http://localhost:3000/users",
      headers: {
        Accept: "application/json"
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

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

  if (isError(state)) {
    return match(state, {
      CancelError: () => (
        <p>Request has been canceled.</p>
      ),
      NetworkError: () => (
        <p>A network error occurred, please try again later.</p>
      ),
      ExpectedError: error => (
        <p>{error.message}</p>
      ),
      UnexpectedError: error => (
        <p>Unexpected error: {error.message}</p>
      )
    });
  }

  return (
    <p>There is {state.length} users in database.</p>
  );
};
```

This way, if anything happens (the server might return a `500` response because something went horribly wrong with our setup), we are guarded through the schema validation (and the status code checking), plus we get the benefit of having a type that is shared between the client & server.

## Type synchronization

Besides being protected against bad data received from the server, we also get the benefit of having a TypeScript type (`Users`) that is synchronized since it exist only in one point (on the server-side).

Updating the schema will necessarily means updating the data we need to return, but also the data that will be received from the client.

In fact, we cannot make any mistakes by following the validation of our schema this way.

## Not a new concept

This concept exist since years with libraries like tRPC (for the TypeScript ecosystem), or gRPC (for a wide-range of programming languages supported) or others like Hono RPC.

One downside of not using any of those libraries in comparison to `saint-bernard` is that this is not something that is baked in the library, as `saint-bernard` only focuses on heavy-lifting the hard work of requesting data and handling errors, but leave you free of using any validation (or not) when receiving anything from the server.

This is a trade-off that you should be aware you are making while using this library in comparison to others like those that were cited above.