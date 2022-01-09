import { Link } from "remix"
import type { FunctionComponent } from "react"

const Home: FunctionComponent = () => {
  return (
    <div className='container'>
      <div className='content'>
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to='jokes'>Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Home
