import React, { useEffect, useState } from "react"
import { render } from "@testing-library/react"
import { describe, test, expect, vi } from "vitest"
import { CancelError, useStatefulRequest, useStatelessRequest } from "."

describe("CancelError", () => {
  test("It should return an error instance", () => {
    expect(new CancelError("")).toBeInstanceOf(Error)
  })

  test("It should return an error with the correct name", () => {
    expect(new CancelError("").name).toEqual("CancelError")
  })
})

describe("useStatefulRequest", () => {
  test("It should work without state nor resolver", () => {
    const spy = vi.spyOn(window, "fetch");

    spy.mockImplementation(() => Promise.resolve(new Response()))

    const Main = () => {
      const { request } = useStatefulRequest({
        initialState: null
      })

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com/users",
          onResponse: async () => {
            return null;
          }
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
      const { state, request } = useStatefulRequest({
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
})

describe("useStatelessRequest", () => {
  test("It should work without state nor resolver", () => {
    const spy = vi.spyOn(window, "fetch");

    spy.mockImplementation(() => Promise.resolve(new Response()))

    const Main = () => {
      const { request } = useStatelessRequest()

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com/users"
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

  test("It should work with an external state", async () => {
    const spy = vi.spyOn(window, "fetch")

    spy.mockImplementation(() => Promise.resolve(new Response("123")))

    const Main = () => {
      const [state, setState] = useState("");
      const { error, request } = useStatelessRequest()

      useEffect(() => {
        request({
          url: "https://jsonplaceholder.typicode.com/users",
          onResponse: async response => {
            const text = await response.text();

            console.log({ text });

            setState(text);
          }
        })
      }, [request])

      if (error) {
        return (
          <p>{error.message}</p>
        )
      }

      return (
        <p>{state}</p>
      )
    }

    const { container } = render(<Main />)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(container.innerText).toEqual("123")

    spy.mockClear()
  })
})
