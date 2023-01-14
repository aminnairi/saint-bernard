import React, { Fragment, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CancelError, useRequest } from "../../../hooks"
import { z } from "zod"

const postsSchema = z.array(z.object({
  body: z.string(),
  title: z.string(),
  userId: z.number(),
  id: z.number()
}))

type Posts = z.infer<typeof postsSchema>

export const UsersUserPostsPage = () => {
  const { user } = useParams()

  const navigate = useNavigate()

  const { data, loading, error, request, cancel } = useRequest<Posts>({
    initialPath: `users/${user}/posts`,
    initialUrl: "https://jsonplaceholder.typicode.com",
    initialQueries: {},
    initialData: [],
    initialOptions: {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    },
    resolver: async (response) => {
      const posts = await response.json()
      return postsSchema.parse(posts)
    }
  })

  const goTo = useCallback((path: string) => () => {
    navigate(path)
  }, [navigate])

  useEffect(() => cancel, [cancel])

  if (loading) {
    return (
      <Fragment>
        <p>Loading...</p>
        <button onClick={cancel}>Cancel</button>
      </Fragment>
    )
  }

  if (error) {
    if (error instanceof CancelError)  {
      return (
        <Fragment>
          <h1>Canceled</h1>
          <p>Request has been canceled</p>
          <button onClick={request}>Retry?</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <h1>Error</h1>
        <p>{error.message}</p>
        <button onClick={request}>Retry?</button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <button onClick={request}>Fetch posts</button>
      {data.length === 0 && (
        <p>No posts to show</p>
      )}
      {data.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {data.map(post => (
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
