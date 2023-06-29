import React, { useEffect } from "react"
import { render } from "@testing-library/react"
import { describe, test, expect, vi } from "vitest"
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
  test("It should work without state nor resolver", () => {
    const spy = vi.spyOn(window, "fetch");

    spy.mockImplementation(() => Promise.resolve(new Response()))

    const Main = () => {
      const { request } = useRequest()

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com/users",
        })
      }, [request])

      return (
        <p>Success</p>
      )
    }

    const { container } = render(<Main />)

    expect(container.innerText).toEqual("Success")

    spy.mockClear();
  });

  test("It should return the data", async () => {
    const spy = vi.spyOn(window, "fetch")

    spy.mockImplementation(() => Promise.resolve(new Response(JSON.stringify([{ id: 1 }]))))

    const Main = () => {
      const { state, request } = useRequest({
        initialState: [],
      })

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com",
          onResponse: response => {
            return response.json()
          }
        })
      }, [request])

      return (
        <p>{JSON.stringify(state)}</p>
      )
    }

    const { container } = render(<Main />)

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(container.innerText).toEqual(JSON.stringify([{ id: 1 }]))
  })

  test("It should return a cancel error", async () => {
    const spy = vi.spyOn(window, "fetch")

    spy.mockImplementation(async (_url, options) => {
      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      })

      if (options?.signal?.aborted) {
        const error = new Error("AbortError")
        error.name = "AbortError"
        throw error
      }

      return Promise.resolve(new Response())
    })

    const Main = () => {
      const { error, cancel, request } = useRequest({
        initialState: []
      })

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com/users",
          onResponse: response => {
            return response.json();
          }
        })
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
        initialState: []
      })

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com/users",
          onResponse: async response => {
            return response.json();
          }
        })
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
