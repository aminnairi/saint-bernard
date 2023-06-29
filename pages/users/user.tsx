import React, { Fragment, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { z } from "zod"
import { CancelError, useStatefulRequest } from "../../hooks"

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  phone: z.string(),
  website: z.string(),
  email: z.string()
})

type User = z.infer<typeof userSchema>

export const UserPage = () => {
  const { user } = useParams()

  const navigate = useNavigate()

  const { state, loading, error, cancel, request } = useStatefulRequest<User | null>({
    initialState: null
  })

  const goTo = useCallback((path: string) => () => {
    navigate(path)
  }, [navigate])

  const getUser = useCallback(() => {
    request({
      url: `https://jsonplaceholder.typicode.com/users/${user}`,
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      onResponse: async response => {
        const json = await response.json();
        const parsed = userSchema.parse(json)

        return parsed;
      }
    });
  }, [user]);

  useEffect(() => cancel, [cancel])

  if (loading) {
    return (
      <Fragment>
        <h1>Loading</h1>
        <p>User informations loading, please wait...</p>
        <button onClick={cancel}>cancel</button>
      </Fragment>
    )
  }

  if (error) {
    if (error instanceof CancelError) {
      return (
        <Fragment>
          <h1>Canceled</h1>
          <p>Request cancled</p>
          <button onClick={getUser}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <p>An error occured</p>
        <small>{error.message}</small>
        <button onClick={getUser}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <h1>User#{user}</h1>
      <button onClick={getUser}>Fetch informations</button>
      {state === null && (
        <p>No informations to show yet</p>
      )}
      {state !== null && (
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{state.name}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{state.username}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{state.phone}</td>
            </tr>
            <tr>
              <td>Website</td>
              <td>{state.website}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{state.email}</td>
            </tr>
            <tr>
              <td>Posts</td>
              <td>
                <button onClick={goTo(`/users/${user}/posts`)}>See posts</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </Fragment>
  )
}
