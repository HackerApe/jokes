import { Link } from "remix"
import type { FunctionComponent } from "react"

const Home: FunctionComponent = () => {
  return (
    <div className='container'>
      <h1 className='mb-3 mt-5'>
        Remix <span>Jokes!</span>
      </h1>
      <Link to='jokes' className='nav-link'>
        Read Jokes
      </Link>
    </div>
  )
}

export default Home
