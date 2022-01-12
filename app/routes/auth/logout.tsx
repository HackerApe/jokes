import { ActionFunction, LoaderFunction, redirect } from "remix"
import { logout } from "~/utils/session.server"

export const action: ActionFunction = ({ request }) => logout(request)
export const loader: LoaderFunction = () => redirect("/")
