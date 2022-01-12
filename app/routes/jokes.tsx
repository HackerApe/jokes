import { Link, Links, Outlet, useLoaderData } from "remix"
import type { FunctionComponent } from "react"
import type { LinksFunction, LoaderFunction } from "remix"
import { User } from "@prisma/client"
import jokesStylesUrl from "~/styles/jokes.css"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: jokesStylesUrl }
]

export interface Joke {
  id: string
  name: string
}

type LoaderData = { user: User | null; jokeList: Array<Joke> }
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  const jokeList = await db.joke.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true }
  })

  return { user, jokeList }
}

const Jokes: FunctionComponent = () => {
  const data: LoaderData = useLoaderData()

  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link to='/' title='Remix Jokes' aria-label='Remix Jokes'>
              <span className='logo'>🤪</span>
              <span className='logo-medium'>J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className='user-info'>
              <span>{`Hi ${data.user.username}`}</span>
              <form action='/logout' method='post'>
                <button type='submit' className='button'>
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <div className='jokes-list'>
            <Link to='.'>Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data?.jokeList?.map((joke: Joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>
            <Link to='new' className='button'>
              Add your own
            </Link>
          </div>
          <div className='jokes-outlet'>
            <Outlet />
            <Links />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Jokes
