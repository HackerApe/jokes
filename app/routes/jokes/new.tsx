import type { FunctionComponent } from "react"

const NewPost: FunctionComponent = () => {
  return (
    <div>
      <h1>Add a new hilarious joke</h1>
      <form method='POST'>
        <div>
          <label htmlFor='jokeName'>Title</label>
          <input type='text' name='jokeName' id='jokeName' />
        </div>

        <div>
          <label htmlFor='jokeContent'>Content</label>
          <textarea name='jokeContent' id='jokeContent'></textarea>
        </div>

        <button type='submit'>Add</button>
      </form>
    </div>
  )
}

export default NewPost
