import type { FunctionComponent } from "react"
import { ActionFunction, json, redirect, useActionData } from "remix"
import type { Joke } from "@prisma/client"
import { db } from "~/utils/db.server"
import { getUserSession, requireUserId } from "~/utils/session.server"

const validateJokeName = (jokeName: string) => {
  if (jokeName.length < 2) return "That's too short for name..."
}

const validateJokeContent = (jokeContent: string) => {
  if (jokeContent.length < 10) return "Try adding more details..."
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    content: string | undefined
  }
  fields?: {
    name: string
    content: string
  }
}
const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const userId = await requireUserId(request)

  const name = form.get("jokeName")
  const content = form.get("jokeContent")

  if (typeof name !== "string" || typeof content !== "string")
    return badRequest({ formError: "Form not submitted correctly..." })

  const fields = { name, content }
  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content)
  }

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields })

  const newJoke: Joke = await db.joke.create({
    data: { ...fields, jokesterId: userId }
  })

  return redirect(`/jokes/${newJoke.id}`)
}

const NewPost: FunctionComponent = () => {
  const actionData = useActionData<ActionData>()

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method='POST'>
        <div>
          <label>
            Name:{" "}
            <input
              type='text'
              name='jokeName'
              id='jokeName'
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-describedby={
                Boolean(actionData?.fieldErrors?.name)
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name && (
            <p className='form-validation-error' role='alert' id='name-error'>
              {actionData.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              name='jokeContent'
              id='jokeContent'
              defaultValue={actionData?.fields?.content}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content && (
            <p
              className='form-validation-error'
              role='alert'
              id='content-error'
            >
              {actionData.fieldErrors.content}
            </p>
          )}
        </div>
        <div>
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPost
