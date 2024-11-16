# `httpRequest`

The `httpRequest` function constructs HTTP requests using the Step Builder Pattern. This pattern provides a fluent and modular API for building and customizing requests step-by-step.

The function wraps the native `fetch` API, returning the same response, making it compatible with existing codebases.

## Example Usage
```typescript
import { httpRequest } from "saint-bernard";

async function makeRequest() {
  const response = await httpRequest()
    .withMethod("POST")
    .withUrl("https://example.com/api")
    .withHeader("Content-Type", "application/json")
    .withBody(JSON.stringify({ key: "value" }))
    .send();

  if (response.ok) {
    console.log("Request successful:", await response.json());
  } else {
    console.error("Request failed:", response.status);
  }
}
```

## `withMethod`

### Signature

```typescript
withMethod(method: string): { withUrl: (url: string) => ... }
```

### Description

Attaches the HTTP method to the request (e.g., `GET`, `POST`, `PUT`, etc.).

### Example

```typescript
httpRequest().withMethod("GET");
httpRequest().withMethod("POST");
```

## `withUrl`

### Signature

```typescript
withUrl(url: string): { withBody: (body: string) => ... }
```

### Description

Specifies the request's target URL.

### Example

```typescript
httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api");
```

## `withBody`

### Signature

```typescript
withBody(body: string): { withHeader: (name: string, value: string) => ... }
```

### Description

Adds a request body, commonly used in `POST` and `PUT` requests.

### Example

```typescript
httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api")
  .withBody(JSON.stringify({ username: "john_doe" }));
```

## `withHeader`

### Signature

```typescript
withHeader(name: string, value: string): { ... }
```

### Description

Adds a single header to the request.

### Example

```typescript
httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api")
  .withHeader("Content-Type", "application/json")
  .withHeader("Authorization", "Bearer token");
```

## `withHeaders`

### Signature

```typescript
withHeaders(headers: Headers): { ... }
```

### Description

Replaces all existing headers with a new `Headers` object.

### Example

```typescript
const headers = new Headers({
  "Content-Type": "application/json",
  "Authorization": "Bearer token",
});

httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api")
  .withHeaders(headers);
```

## `withoutHeader`

### Signature

```typescript
withoutHeader(name: string): { ... }
```

### Description

Removes a specific header from the request.

### Example

```typescript
httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api")
  .withHeader("Authorization", "Bearer token")
  .withoutHeader("Authorization");
```

## `withoutHeaders`

### Signature

```typescript
withoutHeaders(): { ... }
```

### Description

Clears all headers from the request.

### Example

```typescript
httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api")
  .withoutHeaders();
```

## `withIntegrity`

### Signature

```typescript
withIntegrity(integrity: string): { ... }
```

### Description

Adds a Subresource Integrity (SRI) value to the request.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com/script.js")
  .withIntegrity("sha384-LknduRi...");
```

## `withDefaultIntegrity`

### Signature

```typescript
withDefaultIntegrity(): { ... }
```

### Description

Resets the `integrity` value to its default state.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com/script.js")
  .withDefaultIntegrity();
```

## `withReferrer`

### Signature

```typescript
withReferrer(referrer: string): { ... }
```

### Description

Sets the `referrer` for the request.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withReferrer("https://referrer.com");
```

## `withDefaultReferrer`

### Signature

```typescript
withDefaultReferrer(): { ... }
```

### Description

Resets the `referrer` to its default value.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withDefaultReferrer();
```

## `withCache`

### Signature

```typescript
withCache(cache: RequestCache): { ... }
```

### Description

Specifies the cache mode for the request.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withCache("no-cache");
```

## `withDefaultCache`

### Signature

```typescript
withDefaultCache(): { ... }
```

### Description

Resets the `cache` option to its default value.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withDefaultCache();
```

## `withCredentials`

### Signature

```typescript
withCredentials(credentials: RequestCredentials): { ... }
```

### Description

Sets the `credentials` option for the request (e.g., `omit`, `same-origin`, `include`).

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withCredentials("include");
```

## `withDefaultCredentials`

### Signature

```typescript
withDefaultCredentials(): { ... }
```

### Description

Resets the `credentials` option to its default state.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withDefaultCredentials();
```

## `withMode`

### Signature

```typescript
withMode(mode: RequestMode): { ... }
```

### Description

Specifies the `mode` for the request (e.g., `cors`, `no-cors`, `same-origin`).

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withMode("cors");
```

## `withDefaultMode`

### Signature

```typescript
withDefaultMode(): { ... }
```

### Description

Resets the `mode` option to its default value.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withDefaultMode();
```

## `withSignal`

### Signature

```typescript
withSignal(signal: AbortSignal): { ... }
```

### Description

Attaches an `AbortSignal` to the request for cancellation.

### Example

```typescript
const controller = new AbortController();

httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withSignal(controller.signal);
```

## `withoutSignal`

### Signature

```typescript
withoutSignal(): { ... }
```

### Description

Removes the `AbortSignal` from the request.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withoutSignal();
```

## `withUri`

### Signature

```typescript
withUri(uri: string): { ... }
```

### Description

Appends a URI to the base URL while managing slashes automatically.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withUri("/api/resource");
```

## `withoutUri`

### Signature

```typescript
withoutUri(): { ... }
```

### Description

Removes any previously appended URI.

### Example

```typescript
httpRequest()
  .withMethod("GET")
  .withUrl("https://example.com")
  .withoutUri();
```

## `send`

### Signature

```typescript
send(): Promise<Response>
```

### Description

Executes the request and returns a `Promise` resolving to the native `Response` object.

### Example

```typescript
httpRequest()
  .withMethod("POST")
  .withUrl("https://example.com/api")
  .withBody("hello")
  .send()
  .then(response => {
    if (response.ok) {
      console.log("Request succeeded!");
    } else {
      console.error("Request failed.");
    }
  });
```