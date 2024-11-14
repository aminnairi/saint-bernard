# Prior Art

## Tanstack Query

Tanstack Query is a robust data management library known for its advanced features like caching, prefetching, and server-side rendering across various frameworks. Unlike Tanstack Query, which uses error boundaries and exceptions, `saint-bernard` treats errors as values, making error handling simpler and more explicit in React. `saint-bernard` also provides automatic request cancellation and manages loading and error states by default, allowing for reduced lifecycle management code in error-prone environments.

## SWR

SWR by Vercel focuses on RESTful data fetching, leveraging stale-while-revalidate to keep data fresh with automatic revalidation. While SWR relies on error boundaries for exception-based error handling, `saint-bernard` treats errors as manageable values, simplifying error workflows. With built-in loading and data states and automatic request cancellation, `saint-bernard` reduces the need for manual state management, making it ideal for React applications with complex error handling requirements.

## Apollo Client

Apollo Client is designed for GraphQL, providing schema-driven caching, error boundaries, and strong integration with GraphQL schemas. `saint-bernard`, however, offers more flexibility for RESTful or custom HTTP requests without relying on GraphQL schemas. By handling errors as values and managing loading states automatically, `saint-bernard` simplifies data-fetching workflows and provides a streamlined API for structured error handling in React.

## Axios

Axios is a minimalistic HTTP client without built-in caching, state, or error management features, making it ideal for lightweight requests. In contrast, `saint-bernard` includes structured error-as-value handling, automatic state tracking, and request cancellation. This makes `saint-bernard` suitable for projects where lifecycle complexity and error workflows require a more integrated, React-focused solution than Axios alone can provide. 

## Summary

Each of these libraries offers unique strengths, and `saint-bernard` stands out with its versatile error management and lifecycle automation designed for React applications.