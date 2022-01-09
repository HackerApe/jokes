import { Link, Links, Outlet, useLoaderData } from "remix"
import type { FunctionComponent } from "react"
import type { LinksFunction, LoaderFunction } from "remix"
import jokesStylesUrl from "~/styles/jokes.css"
import { db } from "~/utils/db.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: jokesStylesUrl }
]

export interface Joke {
  id: string
  name: string
}

type LoaderData = { jokes: Array<Joke> }
export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokes: await db.joke.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true }
    })
  }

  return data
}

const Jokes: FunctionComponent = () => {
  const data = useLoaderData()

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
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <div className='jokes-list'>
            <Link to='.'>Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokes.map((joke: Joke) => (
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
