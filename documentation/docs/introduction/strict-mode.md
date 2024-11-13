# Strict Mode

A quick note on using the `StrictMode` component from the `react` library.

## What is StrictMode

The `StrictMode` component is a component that helps developers not forget to clean up any listeners, requests, WebSocket connections and so on.

Each time you use the `useEffect` in order to trigger a side-effect, you can also return a callback function that gets called whenever then component gets destroyed.

This is particularily useful if you have some components that gets destroyed and created often (like a page for instance), this helps reduce the numbers of listeners active for one component, as the previous listeners that were activated from previous renders might take up memory for nothing.

## Saint-Bernard and StrictMode

The `saint-bernard` library has already handled this for you, and whenever you use the `useStatefulRequest` or `useStatelessRequest` hooks, it automatically cleanup any ongoing request if the component that called these hooks gets destroyed.

This is essentially what is going on behind the scene of this library.

```typescript
const { cancel } = useStatefulRequest({
  intitialState: []
});

useEffect(() => {
  return () => {
    cancel();
  };
}, []);
```

Of course, you could do that, but that would be cumbersome, and you don't need to, this has already been done for you!

However, since this library has a strong emphasis on error handling, whenever a request has been canceled, it forces you to handle that case.

## Don't use StrictMode

We recommend you don't use StrictMode as `react` will in fact play you HTTP requests twice in order to show you that you forgot to cleanup any ongoing request on component destroy, however by doing so, you will always have the `CancelError` error being triggered, and you will be blocked since this error can't be ignored when using this library, you'll have to handle it by displaying a message in the screen of your user.

However, in development, this can be tedious to test with the `StrictMode` enabled.

## Summary

`StrictMode` is useful if you are creating your HTTP requests by hand since you could forgot to cleanup your HTTP requests, however this library has already done the work for you, so this component is not necessary, and can lead to a worse developer experience.