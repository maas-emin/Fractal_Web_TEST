import { useEffect, useState } from 'react'
import './App.css'

enum SelectType {
  Users = 'users',
  Repos = 'repos',
}

type UserType = {
  name: string
  login: string
}

type RepoType = {
  name: string
  stargazers_count: number
}

const useDelay = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const time = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(time)
    }
  }, [value, delay])
  return debouncedValue
}

const getUser = async (value: string) => {
  const res = await fetch(`https://api.github.com/users/${value}`)
  const data = await res.json()
  return data
}

const getRepo = async (value: string) => {
  const res = await fetch(`https://api.github.com/repos/${value}`)
  const data = await res.json()
  return data
}

const getUserRepos = async (params: string) => {
  const res = await fetch(`https://api.github.com/users/${params}/repos`)
  const data = await res.json()
  return data
}

type UserProps = {
  user?: UserType
}

const User = ({ user }: UserProps) => {
  const [repoCount, setRepoCount] = useState<number>(0)

  useEffect(() => {
    if (!user) {
      return
    }

    getUserRepos(user.login).then((res) => setRepoCount(res?.length ?? 0))
  }, [user])

  if (!user) return null

  return (
    <>
      <h1>Name: {user.name}</h1>
      <h2>Repository: {repoCount}</h2>
    </>
  )
}

type RepoProps = {
  repo?: RepoType
}

const Repo = ({ repo }: RepoProps) => {
  if (!repo) return null

  return (
    <>
      <h1>Name: {repo.name}</h1>
      <h2>Stars: {repo.stargazers_count}</h2>
    </>
  )
}

type ContentType = {
  value: string
  select: SelectType
}

const Content = ({ value, select }: ContentType) => {
  const [user, setUser] = useState<UserType>()
  const [repo, setRepo] = useState<RepoType>()
  const delayeValue = useDelay(value, 1200)

  useEffect(() => {
    if (!delayeValue) {
      return
    }
    if (select === SelectType.Users) {
      getUser(delayeValue).then((res) => {
        setUser(res)
      })

      return
    }

    if (select === SelectType.Repos) {
      getRepo(delayeValue).then((res) => {
        setRepo(res)
      })
      return
    }
  }, [delayeValue, select])

  return (
    <>
      {select === SelectType.Users && <User user={user} />}
      {select === SelectType.Repos && <Repo repo={repo} />}
    </>
  )
}

const App = () => {
  const [select, setSelect] = useState<SelectType>(SelectType.Users)
  const [value, setValue] = useState<string>('')

  const selectValue = (params: SelectType) => {
    setSelect(params)
  }

  return (
    <div className="App">
      <div>
        <h3>Задержка запроса 1200 мс</h3>
        <input type="text" onChange={(e) => setValue(e.target.value)} />
        <select onChange={(e) => selectValue(e.target.value as SelectType)}>
          <option value={SelectType.Users} defaultValue={SelectType.Users}>
            user
          </option>
          <option value={SelectType.Repos}>repo</option>
        </select>
      </div>
      <Content value={value} select={select} />
    </div>
  )
}

export default App
