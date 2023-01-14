import React, { useEffect } from "react"
import { render, waitFor } from "@testing-library/react"
import { describe, test, expect, vi, afterEach } from "vitest"
import { CancelError, useRequest } from "."

describe("CancelError", () => {
  test("It should return an error instance", () => {
    expect(new CancelError("")).toBeInstanceOf(Error)
  })

  test("It should return an error with the correct name", () => {
    expect(new CancelError("").name).toEqual("CancelError")
  })
})

describe("useRequest", () => {
  test("It should return the stringified queries correctly", () => {
    const Main = () => {
      const { stringifiedQueries } = useRequest({
        initialUrl: "https://jsonplaceholder.typicode.com",
        initialPath: "users",
        initialData: [],
        initialQueries: {
          a: "1",
          b: "2"
        },
        initialOptions: {},
        resolver: (response) => response.json()
      })

      return (
        <p>{stringifiedQueries}</p>
      )
    }

    const { container } = render(<Main />)

    expect(container.innerText).toEqual("?a=1&b=2")
  })

  test("It should return the data", async () => {
    const spy = vi.spyOn(window, "fetch")

    spy.mockImplementation(() => Promise.resolve(new Response(JSON.stringify([{id: 1}]))))

    const Main = () => {
      const { data, request } = useRequest({
        initialUrl: "https://jsonplaceholder.typicode.com",
        initialPath: "users",
        initialData: [],
        initialQueries: {},
        initialOptions: {},
        resolver: (response) => response.json()
      })

      useEffect(() => {
        request()
      }, [request])

      return (
        <p>{JSON.stringify(data)}</p>
      )
    }

    const { container } = render(<Main />)

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(container.innerText).toEqual(JSON.stringify([{id: 1}]))
  })

  test("It should return a cancel error", async () => {
    const spy = vi.spyOn(window, "fetch")

    spy.mockImplementation(async (url, options) => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (options?.signal?.aborted) {
        const error = new Error("AbortError")
        error.name = "AbortError"
        throw error
      }

      return Promise.resolve(new Response())
    })

    const Main = () => {
      const { error, cancel, request } = useRequest({
        initialUrl: "https://jsonplaceholder.typicode.com",
        initialPath: "users",
        initialData: [],
        initialQueries: {},
        initialOptions: {},
        resolver: (response) => response.json()
      })

      useEffect(() => {
        request()
      }, [request])

      useEffect(() => {
        cancel()
      }, [cancel])

      if (error && error instanceof CancelError) {
        return (
          <p>Canceled by the user</p>
        )
      }

      return (
        <p>Success</p>
      )
    }

    const { container } = render(<Main />)

    await new Promise(resolve => setTimeout(resolve, 2000))

    expect(container.innerText).toEqual("Canceled by the user")

    spy.mockClear()
  })

  test("It should return an error", async () => {
    const spy = vi.spyOn(window, "fetch")

    spy.mockImplementation(async () => {
      throw new Error("An error occurred")
    })

    const Main = () => {
      const { error, request } = useRequest({
        initialUrl: "https://jsonplaceholder.typicode.com",
        initialPath: "users",
        initialData: [],
        initialQueries: {},
        initialOptions: {},
        resolver: response => response.json()
      })

      useEffect(() => {
        request()
      }, [request])

      if (error) {
        return (
          <p>{error.message}</p>
        )
      }

      return (
        <p>Success</p>
      )
    }

    const { container } = render(<Main />)

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(container.innerText).toEqual("An error occurred")

    spy.mockClear()
  })
})
