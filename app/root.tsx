import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix"
import type { MetaFunction } from "remix"
import type { FunctionComponent, PropsWithChildren } from "react"
import globalStylesUrl from "~/styles/global.css"
import globalMediumStylesUrl from "~/styles/global-medium.css"
import globalLargeStylesUrl from "~/styles/global-large.css"

export const links: LinksFunction = () => [
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
      <Outlet />
    </Document>
  )
}

const Document: FunctionComponent = ({ children }: PropsWithChildren<{}>) => {
  return (
    <html lang='en'>
      <head>
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
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to='/'>J🤪kes</Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  )
}

export default App
