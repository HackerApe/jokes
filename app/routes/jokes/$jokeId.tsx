import { Link, useLoaderData, useParams } from "remix"
import type { FunctionComponent } from "react"
import type { LoaderFunction } from "remix"
import { db } from "~/utils/db.server"
import type { Joke } from "@prisma/client"

type LoaderData = { joke: Joke }
export const loader: LoaderFunction = async ({ params }) => {
  const jokeId = params.jokeId
  const joke = await db.joke.findUnique({ where: { id: jokeId } })

  if (!joke) throw new Error("Joke not found...")
  const data: LoaderData = { joke }

  return data
}

const Joke: FunctionComponent = () => {
  const data = useLoaderData()

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to='.'>{data.joke.name} Permalink</Link>
    </div>
  )
}

export default Joke
