import React, { Fragment, ReactNode, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { z } from "zod"
import { ExpectedError, GET, isError, match, useStatefulRequest } from "saint-bernard"

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  phone: z.string(),
  website: z.string(),
  email: z.string()
})

type User = z.infer<typeof userSchema>

export const UserPage = (): ReactNode => {
  const { user } = useParams()

  const navigate = useNavigate()

  const { state, loading, cancel, request } = useStatefulRequest<User | null>({
    initialState: null
  })

  const goTo = useCallback((path: string) => () => {
    navigate(path)
  }, [navigate])

  const getUser = useCallback(() => {
    request(async ({ signal }) => {
      const response = await GET
        .withUrl(`https://jsonplaceholder.typicode.com/users/${user}`)
        .withHeader("Accept", "application/json")
        .withSignal(signal)
        .send();

      const json = await response.json();
      const validation = userSchema.safeParse(json)

      if (!validation.success) {
        return new ExpectedError("Bad response from the server");
      }

      return validation.data;
    });
  }, [request, user]);

  useEffect(() => {
    getUser();
  }, [getUser])

  if (loading) {
    return (
      <Fragment>
        <h1>Loading</h1>
        <p>User informations loading, please wait...</p>
        <button onClick={cancel}>cancel</button>
      </Fragment>
    )
  }

  if (isError(state)) {
    return match(state, {
      CancelError: () => (
        <Fragment>
          <h1>Canceled</h1>
          <p>Request has been canceled</p>
          <button onClick={getUser}>Retry?</button>
        </Fragment>
      ),
      ExpectedError: error => (
        <Fragment>
          <h1>Error</h1>
          <p>An error has occurred.</p>
          <small>{error.message}</small>
          <button onClick={getUser}>Retry?</button>
        </Fragment>
      ),
      NetworkError: () => (
        <Fragment>
          <h1>Network Error</h1>
          <p>Are you still connected to the internet?</p>
          <button onClick={getUser}>Retry?</button>
        </Fragment>
      ),
      UnexpectedError: error => (
        <Fragment>
          <h1>Unexpected error</h1>
          <p>An unexpected error occurred, please try again later.</p>
          <small>{error.message}</small>
          <button onClick={getUser}>Retry?</button>
        </Fragment>
      )
    });
  }

  return (
    <Fragment>
      <h1>User#{user}</h1>
      <button onClick={getUser}>Fetch informations</button>
      {state === null ? (
        <p>No informations to show yet</p>
      ) : (
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