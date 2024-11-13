# match

The `match` function is inspired by functional programming, especially the Haskell language which has a `match` keyword that can exhaustively walk through one value, and ensure you handled every possible cases for that value.

The `match` function is very similar in the sense that it will help you walk through each and every possible error case for a state. Of course it is made specifically for this library, and is not interesting outside the scope of `saint-bernard`.

## Usage

Let's say that we have a state that has been returned either by the `useStatefulRequest` or the `useStatelessRequest`.

```typescript
type State<Type> =
  | Type
  | CancelError
  | NetworkError
  | UnexpectedError
  | ExpectedError
```

This is pretty much the representation that is used internally by the `saint-bernard` source-code.

Now, let's say we have a state.

```typescript
const state: State<string> = "Saint-Bernard goes woof";
```

Here, the `match` function can help you execute code that you would normally write using a conditional statement like `if` or `switch` whenether there is an error.

::: info
This function is expected to be used with the [`isError`](./is-error.md) function. The `match` keyword only match against a set of error, not the value.
:::

```typescript
import { match, isError } from "saint-bernard";

if (isError(state)) {
  match(state, {
    NetworkError: () => {
      console.log("Network error.");
    },
    CancelError: () => { 
      console.log("Network error.");
    },
    UnexpectedError: error => { 
      console.log("Network error.");
    },
    ExpectedError: error => { 
      console.log("Network error.");
    }
  });
}
```

One key difference between the `match` function and the `if` and `switch` statement is that it is an expression, and you can store the result of an expression inside of a variable, or event return it. In fact, that is what is used in the examples and this helps you write easier and better code.

```typescript

if (isError(state)) {
  const errorCode = match(state, {
    NetworkError: () => {
      return 1;
    },
    CancelError: () => { 
      return 2;
    },
    UnexpectedError: error => { 
      return 3;
    },
    ExpectedError: error => { 
      return 4;
    }
  });

  console.log(`Error code: ${errorCode}.`);
}
```

It also prevents you from doing manual instance comparisons.

```typescript
let errorCode = -1;

if (state instanceof CancelError) {
  errorCode = 1;
} else if (state instanceof NetworkError) {
  errorCode = 2;
} else if (state instanceof UnexpectedError) {
  errorCode = 3;
} else if (state instanceof ExpectedError) {
  errorCode = 4;
}
```

Of course, if you need to, you can still use `if` statement and/or `switch` statements as well.