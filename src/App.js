import React, {useState, useEffect, useRef} from 'react'

const useSemiPersistantState = function(key, initialState) {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  )

  useEffect(() => {
    localStorage.setItem(key, value)
    }, [value, key]
  )

  return [value, setValue]
}

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

const App = function() {
  const [searchTerm, setSearchTerm] = useSemiPersistantState('search', 'React')

  const [stories, setStories] = useState(initialStories)

  const handleRemoveStory = function(item) {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    )

    setStories(newStories)
  }

  const handleSearch = (event) => (
    setSearchTerm(event.target.value)
  )

  const searchedStories = stories.filter(
    (story) => story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="Search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search :</strong>
      </InputWithLabel>
      <hr />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  )
}

const InputWithLabel = function({type="text", id, value, onInputChange, isFocused, children}) {
  const inputRef = useRef()

  useEffect(function(){
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input ref={inputRef} type={type} id={id} value={value} onChange={onInputChange} />
    </>
  )
}

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
)

const Item = function({ item, onRemoveItem }) {
  return (
    <li>
      <span><a href={item.url}>{item.title}</a></span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
      <span> {item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)} >
          Dismiss
        </button>
      </span>
    </li>
  )
}

export default App
