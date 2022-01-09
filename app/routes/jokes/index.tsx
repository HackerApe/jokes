import { Link, useLoaderData } from "remix"
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

export default JokesList
