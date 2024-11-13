# saint-bernard

## What is `saint-bernard`?

`saint-bernard` is a React library for requesting data from HTTP servers.

## What language has been used to create `saint-bernard`?

The `saint-bernard` library has been written in TypeScript, from the ground up, and has a 100% TypeScript source-code. It does not have a build step, and the full TypeScript library has been published over NPM.

## How does `saint-bernard` handles error?

Contrary to the Fetch Web API, `saint-bernard` enhance this API by providing a more thorough error handling, preventing you and your team from making mistakes while manipulating the data reveived from the server. No more forgetting the error handling part.

### How can I handle the loading and data states?

As `saint-bernard` is built uppon the React library, it exposes both a data state as well as a loading state, allowing you to provide a better user experience while the data is fetched from the server. Forget about declaring a loading state, this library has already though this for you.

### Should I cancel my requests when the component gets destroyed?

You don't have to manually call the `cancel` request exposed by the `useStatefulRequest` and `useStatelessRequest` as this library automatically handles this for you, enabling you to focus more on your use case and less on the implementation details.