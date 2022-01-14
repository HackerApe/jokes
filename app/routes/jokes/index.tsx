import { Link, useLoaderData, useCatch } from "remix"
import type { FunctionComponent } from "react"
import type { LoaderFunction } from "remix"
import { db } from "~/utils/db.server"
import { Joke } from "@prisma/client"

const getRandomJoke = async () => {
  const count = await db.joke.count()

  const randomRowNumber = Math.floor(Math.random() * count)

  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber
  })

  if (!randomJoke)
    throw new Response("No random joke was found...", { status: 404 })

  return randomJoke
}

type LoaderData = { randomJoke: Joke }
export const loader: LoaderFunction = async () => {
  const randomJoke = await getRandomJoke()
  const data: LoaderData = { randomJoke }
  return data
}

const JokesList: FunctionComponent = () => {
  const data = useLoaderData()

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  )
}

export const ErrorBoundary: FunctionComponent = () => (
  <div className='error-container'>I did a whoopies...</div>
)

export const CatchBoundary = () => {
  const caught = useCatch()

  if (caught.status === 404)
    return <div className='error-container'>There are no jokes to display</div>

  throw new Error(`Unhandled caught response with status ${caught.status}`)
}

export default JokesList
