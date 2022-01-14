import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch
} from "remix"
import type { MetaFunction, LoaderFunction } from "remix"
import type { FunctionComponent, PropsWithChildren } from "react"
import globalStylesUrl from "~/styles/global.css"
import globalMediumStylesUrl from "~/styles/global-medium.css"
import globalLargeStylesUrl from "~/styles/global-large.css"
import { getUser } from "./utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return { user }
}

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  },

  { rel: "stylesheet", href: globalStylesUrl },

  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)"
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)"
  }
]

export const meta: MetaFunction = () => {
  const title = "Jokes application"
  const name = "viewport"
  const content = "width=device-width"

  return {
    title,
    name,
    content
  }
}

const App: FunctionComponent = () => {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

interface IDocument {
  title?: string
}
const Document: FunctionComponent = ({
  children,
  title
}: PropsWithChildren<IDocument>) => {
  return (
    <html lang='en'>
      <head>
        <title>{title ? title : "My remix app"}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

const Layout: FunctionComponent = ({ children }: PropsWithChildren<{}>) => {
  const loaderData = useLoaderData()

  return (
    <div className='container'>
      <nav className='mt-4'>
        <ul className='nav mb-3'>
          <li className='nav-item'>
            <Link to='/' className='nav-link'>
              J🤪kes
            </Link>
          </li>

          {loaderData?.user ? (
            <li className='nav-item'>
              <form action='/auth/logout' method='post'>
                <button type='submit' className='button'>
                  Logout
                </button>
              </form>
            </li>
          ) : (
            <li className='nav-item'>
              <Link to='/auth/login' className='nav-link'>
                Login
              </Link>
            </li>
          )}

          <li className='nav-item'>
            <Link to='/jokes/new' className='nav-link'>
              Add a new joke
            </Link>
          </li>
        </ul>
      </nav>

      {children}
    </div>
  )
}

type IErrorBoundary = {
  error: Error
}
export const ErrorBoundary: any = ({ error }: IErrorBoundary) => {
  return (
    <Document title='Uh, oh!'>
      <div className='error-container'>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className='error-container'>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  )
}

export default App
