import React, { Fragment } from "react"
import { Routes, Route } from "react-router-dom"
import { UsersUserPostsPage } from "./src/pages/users/user/posts"
import { HomePage } from "./src/pages/home"
import { UsersPage } from "./src/pages/users"
import { Header } from "./src/components/header"
import { UserPage } from "./src/pages/users/user"

export const Main = () => {
  return (
    <Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:user" element={<UserPage />} />
        <Route path="/users/:user/posts" element={<UsersUserPostsPage />} />
      </Routes>
    </Fragment>
  )
}
