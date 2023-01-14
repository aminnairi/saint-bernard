import React, { Fragment } from "react"
import { Routes, Route } from "react-router-dom"
import { UsersUserPostsPage } from "./pages/users/user/posts"
import { HomePage } from "./pages/home"
import { UsersPage } from "./pages/users"
import { Header } from "./components/header"
import { UserPage } from "./pages/users/user"

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
