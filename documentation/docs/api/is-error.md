# isError

The `isError` function helps discriminate the state from any error that can occur.

When using the `state` property from any hook, whether `useStatefulRequest` or `useStatelessRequest`, you will get an enumeration that looks like that.

```typescript
type State<Type> =
  | Type
  | CancelError
  | NetworkError
  | UnexpectedError
  | ExpectedError
```

You could argue that this is not very practical, but this implies something that is highly beneficial for any applications that aims to seek robustness and reliability: predictability in the behavior.

Predictability here means that you can be sure that any request has to be checked, whether manually, or through the use of helpers like the `isError` function exposed by the `saint-bernard` library.

## Manual checking

You don't really need the `isError` function in order to check whether the state is indeed the type you expected it to be. It can easily be done manually.

```typescript
const state: State<number> = 123.4567890;

if (state instanceof CancelError) {
  console.error("Request canceled.");
} else if (state instanceof NetworkError) {
  console.error("Network error.");
} else if (state instanceof UnexpectedError) {
  console.error(`Unexpected error: ${state.message}`);
} else if (state instanceof ExpectedError) {
  console.error(`Error: ${state.message}`);
} else {
  console.log(state.toFixed(2));
}
```

If you only care about the data, and the error is not of importance for you, you can still benefit for a little bit of security in here, while be assured to get the data when necessary when using the `isError` function.

Let's say that you want to display the same message for all errors, it would be cumbersome to do so in this example.

```typescript
const state: State<number> = 123.4567890;

if (state instanceof CancelError) {
  console.error("An error occurred"); // [!code focus]
} else if (state instanceof NetworkError) {
  console.error("An error occurred"); // [!code focus]
} else if (state instanceof UnexpectedError) {
  console.error("An error occurred"); // [!code focus]
} else if (state instanceof ExpectedError) {
  console.error("An error occurred"); // [!code focus]
} else {
  console.log(state.toFixed(2));
}
```

Instead, we can leverage the use of the `isError` function in order to properly discriminate the error from the data.

```typescript
import { isError } from "saint-bernard";

const state: State<number> = 123.4567890;

if (isError(state)) {
  console.error("An error occurred");
} else {
  console.log(state.toFixed(2));
}
```

That's way easier this way than manually adding all logs necessary for our use case.

Any value that is not a valid `saint-bernard` error will return `false`.

```typescript
isError(new Error); // false
isError(new AbortError); // false
isError("saint-bernard"); // false
```

While any valid `saint-bernard` error will return `true`.

```typescript
isError(new CancelError); // true
isError(new NetworkError); // true
isError(new UnexpectedError("because reasons")); // true
```