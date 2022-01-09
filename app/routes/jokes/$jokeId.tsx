import type { FunctionComponent } from "react"
import { useParams } from "remix"

const Joke: FunctionComponent = () => {
  const params = useParams()

  return (
    <div>
      <h1>Single joke with id: ${params.jokeId}</h1>
    </div>
  )
}

export default Joke
