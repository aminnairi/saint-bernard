# saint-bernard

React Hook for requesting data using the Web API Fetch written in TypeScript

[![NPM](https://badgen.net/npm/v/saint-bernard)](https://www.npmjs.com/package/saint-bernard) [![Coverage Status](https://coveralls.io/repos/github/aminnairi/saint-bernard/badge.svg?branch=production)](https://coveralls.io/github/aminnairi/saint-bernard?branch=production) ![Vulnerabilities](https://badgen.net/snyk/aminnairi/saint-bernard) [![Size](https://badgen.net/bundlephobia/minzip/saint-bernard)](https://bundlephobia.com/package/saint-bernard@latest) [![Types](https://badgen.net/npm/types/saint-bernard)](https://github.com/aminnairi/saint-bernard)

## Summary

## Features

- Close to the metal, configurable yet high-level enough to help you do more with less
- Tested to cover 100% of the source-code published
- Zero-dependencies
- Lightweight
- Written in TypeScript from the ground up
- Strict semantic versionning for the releases
- Best when used with [`zod`](https://www.npmjs.com/package/zod)
- Leveraging the [Web API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Full control over the options, url, path & query parameters
- Ability to cancel requests at any time
- Written to fully work with modern React Hooks and functional components

[Back to summary](#summary).

## Requirements

- [React 16.8.0+](https://www.npmjs.com/package/react)
- [Node](https://nodejs.org)
- [NPM](https://www.npmjs.com/)

[Back to summary](#summary).

## Installation

```bash
npm install --save --save-exact saint-bernard
```

[Back to summary](#summary).

## Uninstallation

```bash
npm uninstall saint-bernard
```

[Back to summary](#summary).

## Usage

### Stateful

#### state

```typescript
import React from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { state } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  return (
    <ul>
      {state.map(user => (
        <li key={user.id}>
          {user.email}
        </li>
      ))}
    </ul>
  );
};
```

#### setState

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { setState } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    setState([]);
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### request

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { request } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      onResponse: async response => {
        const users = await response.json();

        return users;
      }
    });
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### cancel

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { cancel } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### error

```typescript
import React from "react";
import { useStatefulRequest, CancelError } from "saint-bernard";

export const App = () => {
  const { error } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  if (error) {
    if (error instanceof CancelError) {
      return <h1>Request was cancelled</h1>;
    }

    return <h1>Something went wrong: {error.message}</h1>;
  }

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### setError

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { setError } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    setError(new Error("Something went wrong"));
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### loading

```typescript
import React from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { loading } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### setLoading

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { setLoading } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### abortController

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { abortController } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    abortController.abort();
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### setAbortController

```typescript
import React, { useEffect } from "react";
import { useStatefulRequest } from "saint-bernard";

export const App = () => {
  const { setAbortController } = useStatefulRequest<Array<any>>({
    initialState: []
  });

  useEffect(() => {
    setAbortController(new AbortController());
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

### Stateless

#### request

```typescript
import React, { useEffect } from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { request } = useStatelessRequest();

  useEffect(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: "user@domain.com"
      }),
      onResponse: async response => {
        if (response.ok) {
          console.log("Cool!");
        } else {
          console.log("Uncool...")
        }
      }
    });
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### cancel

```typescript
import React, { useEffect } from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { cancel } = useStatelessRequest();

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### error

```typescript
import React from "react";
import { useStatelessRequest, CancelError } from "saint-bernard";

export const App = () => {
  const { error } = useStatelessRequest();

  if (error) {
    if (error instanceof CancelError) {
      return <h1>Request was cancelled</h1>;
    }

    return <h1>Something went wrong: {error.message}</h1>;
  }

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### setError

```typescript
import React, { useEffect } from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { setError } = useStatelessRequest();

  useEffect(() => {
    setError(new Error("Something went wrong"));
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### loading

```typescript
import React from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { loading } = useStatelessRequest();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### setLoading

```typescript
import React, { useEffect } from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { setLoading } = useStatelessRequest();

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### abortController

```typescript
import React, { useEffect } from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { abortController } = useStatelessRequest();

  useEffect(() => {
    abortController.abort();
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

#### setAbortController

```typescript
import React, { useEffect } from "react";
import { useStatelessRequest } from "saint-bernard";

export const App = () => {
  const { setAbortController } = useStatelessRequest();

  useEffect(() => {
    setAbortController(new AbortController());
  }, []);

  return (
    <h1>Saint-Bernard</h1>
  );
};
```

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

[Back to summary](#summary).

## Code of conduct

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

[Back to summary](#summary).

## License

See [`LICENSE`](./LICENSE).

[Back to summary](#summary).

## Security

See [`SECURITY.md`](./SECURITY.md).

[Back to summary](#summary).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

[Back to summary](#summary).
