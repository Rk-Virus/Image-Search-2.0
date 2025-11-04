import React from 'react'
import { useState } from 'react'
import Footer from './Footer'
import NavBar from './NavBar'

const Home = () => {
  // kept minimal — you can wire search state later
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // placeholder: perform search with `query`
    console.log('search for', query)
  }
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-6">
        <header>
          <h1>Image Search</h1>
          <form id="searchForm" className='flex gap-4' onSubmit={handleSubmit}>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              placeholder="Enter search term"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" id="searchBtn">Search</button>
          </form>
        </header>

        <main>
          <h2>Search Results</h2>
          <div id="imageGallery">No image to display :|</div>

          <div id="pagination">
            <button id="prevPage" type="button">Previous</button>
            <button id="nextPage" type="button">Next</button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Home