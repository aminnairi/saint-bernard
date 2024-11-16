import React, { Fragment, ReactNode, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ExpectedError, GET, isError, match, useStatefulRequest } from "saint-bernard"
import { z } from "zod"

const postsSchema = z.array(z.object({
  body: z.string(),
  title: z.string(),
  userId: z.number(),
  id: z.number()
}))

type Posts = z.infer<typeof postsSchema>

export const UsersUserPostsPage = (): ReactNode => {
  const { user } = useParams()

  const navigate = useNavigate()

  const { state, loading, request, cancel } = useStatefulRequest<Posts>({
    initialState: []
  })

  const getUserPosts = useCallback(() => {
    request(async ({ signal }) => {
      const response = await GET()
        .withUrl(`https://jsonplaceholder.typicode.com/users/${user}/posts`)
        .withHeader("Accept", "application/json")
        .withSignal(signal)
        .send();

      const json = await response.json();
      const validation = postsSchema.safeParse(json)

      if (!validation.success) {
        return new ExpectedError("Bad response from the server.");
      }

      return validation.data;
    });
  }, [request, user]);

  const goTo = useCallback((path: string) => () => {
    navigate(path)
  }, [navigate])

  useEffect(() => {
    getUserPosts();
  }, [getUserPosts])

  if (loading) {
    return (
      <Fragment>
        <p>Loading...</p>
        <button onClick={cancel}>Cancel</button>
      </Fragment>
    )
  }

  if (isError(state)) {
    return match(state, {
      CancelError: () => (
        <Fragment>
          <h1>Canceled</h1>
          <p>Request has been canceled</p>
          <button onClick={getUserPosts}>Retry?</button>
        </Fragment>
      ),
      ExpectedError: error => (
        <Fragment>
          <h1>Error</h1>
          <p>An error has occurred.</p>
          <small>{error.message}</small>
          <button onClick={getUserPosts}>Retry?</button>
        </Fragment>
      ),
      NetworkError: () => (
        <Fragment>
          <h1>Network Error</h1>
          <p>Are you still connected to the internet?</p>
          <button onClick={getUserPosts}>Retry?</button>
        </Fragment>
      ),
      UnexpectedError: error => (
        <Fragment>
          <h1>Unexpected error</h1>
          <p>An unexpected error occurred, please try again later.</p>
          <small>{error.message}</small>
          <button onClick={getUserPosts}>Retry?</button>
        </Fragment>
      )
    });
  }

  return (
    <Fragment>
      <button onClick={getUserPosts}>Fetch posts</button>
      {state.length === 0 && (
        <p>No posts to show</p>
      )}
      {state.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {state.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.body}</td>
                <td>
                  <button onClick={goTo(`/users/${post.userId}`)}>See author</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  )
}
