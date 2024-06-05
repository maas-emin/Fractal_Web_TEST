import { useEffect, useState } from 'react'
import './App.css'

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

interface TypeUser {
  name: string
  login: string
}

interface TypeRepo {
  name: string
  stargazers_count: number
}

type TypeRepoComponent = {
  repo?: TypeRepo
  starsRepo: number
}

type TypeUserComponent = {
  user?: TypeUser
  userrepo: number
}

const UserRepo = ({ user, userrepo }: TypeUserComponent) => {
  if (!user) return null
  return (
    <>
      <h1>FullName: {user.name}</h1>
      <h2>Stars: {userrepo}</h2>
    </>
  )
}

const Repo = ({ repo, starsRepo }: TypeRepoComponent) => {
  if (!repo) return null
  return (
    <>
      <h1>FullName: {repo.name}</h1>
      <h2>Repository: {starsRepo}</h2>
    </>
  )
}

const ServerRequest = ({ name, select }: { name: string; select: string }) => {
  const [user, setUser] = useState<TypeUser>({
    name: '',
    login: '',
  })
  const [repo, setRepo] = useState<TypeRepo>({
    name: '',
    stargazers_count: 0,
  })
  const [userRepo, setUserRepo] = useState<number>(0)
  const [starsRepo, setStarsRepo] = useState<number>(0)
  const delaySearceh = useDelay(name, 1200)

  const getUsers = async () => {
    const res = await fetch(`https://api.github.com/users/${delaySearceh}`)
    const data = await res.json()
    return data
  }

  const getRepos = async () => {
    const res = await fetch(`https://api.github.com/repos/${delaySearceh}`)
    const data = await res.json()
    return data
  }

  const getRepositoriesUser = async (params: string) => {
    const res = await fetch(`https://api.github.com/users/${params}/repos`)
    const data = await res.json()
    return data
  }

  useEffect(() => {
    if (delaySearceh) {
      if (select === 'users') {
        getUsers().then((res) => {
          setUser(res)
          getRepositoriesUser(res.login).then((res) => setUserRepo(res.length))
        })
      } else if (select === 'repos') {
        getRepos().then((res) => {
          setRepo(res)
          setStarsRepo(res.stargazers_count)
        })
      }
    }
  }, [delaySearceh])

  return (
    <>
      {select === 'users' && <UserRepo user={user} userrepo={userRepo} />}
      {select === 'repos' && <Repo repo={repo} starsRepo={starsRepo} />}
    </>
  )
}

const App = () => {
  const [select, setSelect] = useState<string>('users')
  const [name, setName] = useState<string>('')

  const selectValue = (params: string) => {
    setSelect(params)
  }

  return (
    <div className="App">
      <div>
        <form action="submit">
          <h3>Задержка запроса 1200 мс</h3>
          <input type="text" onChange={(e) => setName(e.target.value)} />
          <select onChange={(e) => selectValue(e.target.value)}>
            <option value="users" defaultValue={'users'}>
              user
            </option>
            <option value="repos">repo</option>
          </select>
        </form>
      </div>
      <ServerRequest name={name} select={select} />
    </div>
  )
}

export default App
