import React, { Fragment, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CancelError, useStatefulRequest } from "../hooks"
import { z } from "zod"

const usersSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  phone: z.string(),
  website: z.string(),
  email: z.string()
}))

type Users = z.infer<typeof usersSchema>

export const UsersPage = () => {
  const navigate = useNavigate()

  const { state, error, loading, request, cancel } = useStatefulRequest<Users>({
    initialState: [],
    initialLoading: true
  })

  const goTo = useCallback((path: string) => () => {
    navigate(path)
  }, [navigate])

  const getUsers = useCallback(() => {
    request({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      timeoutInMilliseconds: 100,
      headers: {
        "Accept": "application/json"
      },
      onResponse: async response => {
        const users = await response.json()
        const parsed = usersSchema.parse(users)

        return parsed
      }
    })
  }, [])

  useEffect(() => cancel, [cancel])

  if (loading) {
    return (
      <Fragment>
        <h1>Loading</h1>
        <p>Loading users, please wait...</p>
        <button onClick={cancel}>Cancel</button>
      </Fragment>
    )
  }

  if (error) {
    if (error instanceof CancelError) {
      return (
        <Fragment>
          <h1>Canceled</h1>
          <p>Request cancel or timed out.</p>
          <button onClick={getUsers}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <p>Something went wrong</p>
        <small>{error.message}</small>
        <button onClick={getUsers}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <h1>Users</h1>
      <button onClick={getUsers}>Fetch users</button>
      {state.length === 0 && (
        <p>No users to show</p>
      )}
      {state.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Posts</th>
            </tr>
          </thead>
          <tbody>
            {state.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td>{user.website}</td>
                <td>
                  <button onClick={goTo(`/users/${user.id}/posts`)}>See posts</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  )
}
