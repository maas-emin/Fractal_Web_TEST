import { useEffect, useState } from 'react'
import './App.css'

interface TypeValue {
  name: string
  login: string
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

interface TypeValue {
  name: string
  login: string
  stargazers_count: number
  type: string
}

type TypeResult = {
  value: TypeValue
  starsAndRepositories: number
}

const Result = ({ value, starsAndRepositories }: TypeResult) => {
  return (
    <>
      <h1>FullName: {value.name}</h1>
      <h2>
        {!value.type ? 'Stars:' : 'Repository:'} {starsAndRepositories}
      </h2>
    </>
  )
}

const ServerRequest = ({
  name,
  activeselect,
}: {
  name: string
  activeselect: string
}) => {
  const [value, setValue] = useState<TypeValue>({
    name: '',
    login: '',
    stargazers_count: 0,
    type: '',
  })
  const [starsAndRepositories, setStarsAndRepositories] = useState<number>(0)
  const delaySearceh = useDelay(name, 1200)

  const handlerRequest = async () => {
    const res = await fetch(
      `https://api.github.com/${activeselect}/${delaySearceh}`
    )
    const data = await res.json()
    return data
  }

  const getRepositoriesUser = async (param: string) => {
    const res = await fetch(`https://api.github.com/users/${param}/repos`)
    const data = await res.json()
    return data
  }

  useEffect(() => {
    if (delaySearceh) {
      handlerRequest().then((res) => {
        setValue(res)
        if (res.type) {
          getRepositoriesUser(res.login).then((res) =>
            setStarsAndRepositories(res.length)
          )
        } else {
          setStarsAndRepositories(res.stargazers_count)
        }
      })
    }
  }, [delaySearceh])

  return (
    <>
      <Result value={value} starsAndRepositories={starsAndRepositories} />
    </>
  )
}

const App = () => {
  const [activeSelcet, setActiveSelect] = useState<string>('users')
  const [name, setName] = useState<string>('')

  const selectValue = (select: string) => {
    setActiveSelect(select)
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
      <ServerRequest name={name} activeselect={activeSelcet} />
    </div>
  )
}

export default App
