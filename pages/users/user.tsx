import React, { Fragment, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { z } from "zod"
import { CancelError, useRequest } from "../../hooks"

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

  const { data, loading, error, cancel, request } = useRequest<User | null>({
    initialPath: `users/${user}`,
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialQueries: {},
    initialOptions: {},
    initialData: null,
    resolver: async response => {
      const user = await response.json()
      return userSchema.parse(user)
    }
  })

  const goTo = useCallback((path: string) => () => {
    navigate(path)
  }, [navigate])

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
          <button onClick={request}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <p>An error occured</p>
        <small>{error.message}</small>
        <button onClick={request}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <h1>User#{user}</h1>
      <button onClick={request}>Fetch informations</button>
      {data === null && (
        <p>No informations to show yet</p>
      )}
      {data !== null && (
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{data.name}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{data.username}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{data.phone}</td>
            </tr>
            <tr>
              <td>Website</td>
              <td>{data.website}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{data.email}</td>
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
