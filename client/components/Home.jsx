import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import NavBar from './NavBar'
import axios from 'axios'

const Home = () => {
  // query and user state
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(null)
  const [searched, setSearched] = useState('')
  const [total, setTotal] = useState(0)
  const [topSearches, setTopSearches] = useState([]) // top searches
  const [history, setHistory] = useState([]) // user search history

  // Search state
  const [images, setImages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([])

  // Replace with your Vite env var: VITE_UNSPLASH_KEY
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const PER_PAGE = 8

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(API_BASE_URL+'/api/auth/login/success', {
          withCredentials: true,
        })
        if (response.status === 200 && response.data) {
          setUser(response.data.user)
          console.log('Fetched user:', response.data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      }
    }

    const getTopSearches = async () => {
      try {
        const res = await axios.get(API_BASE_URL+'/api/user/top-searches')
        setTopSearches(res.data.data || [])
      } catch (err) {
        console.error('Error fetching top searches:', err)
      }
    }

    fetchUser()
    getTopSearches()
  }, [])

  // fetch user history only after `user` state is set
  useEffect(() => {
    if (!user) return

    const getUserHistory = async () => {
      try {
        const res = await axios.get(API_BASE_URL+'/api/user/history', {
          withCredentials: true,
        })
        setHistory(res.data.data || [])
        console.log('User search history:', res.data)
      } catch (err) {
        console.error('Error fetching user history:', err)
      }
    }

    getUserHistory()
  }, [user])

  const fetchImages = async (searchTerm, page = 1) => {
    if (!searchTerm) return
    setLoading(true)
    setError('')
    try {
      // add search to db
      await axios.post(API_BASE_URL+'/api/user/add-search', { term: searchTerm }, {
        withCredentials: true,
      })

      // Unsplash API call
      const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: searchTerm,
          page,
          per_page: PER_PAGE,
          client_id: UNSPLASH_KEY,
        },
      })
      console.log(res.data)
      setSearched(searchTerm)
      setTotal(res.data.total || 0)
      setImages(res.data.results || [])
      setCurrentPage(page)
      setSelectedIds([])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to fetch images. Check your Unsplash key and network.')
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to perform a search.')
      return
    }
    // Start search at page 1
    fetchImages(query.trim(), 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchImages(query.trim(), currentPage - 1)
    }
  }

  const handleNext = () => {
    // next page
    fetchImages(query.trim(), currentPage + 1)
  }

  // Multi-select helpers
  const toggleSelect = (e, id) => {
    e.stopPropagation() // to stop bubbling effect
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const clearSelection = () => setSelectedIds([])

  const downloadSelected = () => {
    // open each selected image in new tab (user can save manually)
    const selected = images.filter(img => selectedIds.includes(img.id))
    selected.forEach(img => {
      const url = img.urls?.full || img.urls?.regular || img.urls?.raw
      if (url) window.open(url, '_blank', 'noopener')
    })
  }

  const isSelected = (id) => selectedIds.includes(id)

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <div className="container mx-auto px-4 py-6">
        <header>
          <h1 className="text-2xl font-bold mb-4">Image Search</h1>

          <form id="searchForm" className="flex gap-4 mb-6" onSubmit={handleSubmit}>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              placeholder="Enter search term"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              id="searchBtn"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Search
            </button>
          </form>
        </header>

        <main>
          <div className="flex items-center justify-between mb-3">
            {!loading && searched && <h2 className="text-lg font-semibold">You searched for {searched} -- {total} results</h2>}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected: {selectedIds.length} {selectedIds.length>1 ? 'images': 'image'}</span>
                <button
                  type="button"
                  onClick={downloadSelected}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Open Selected
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div id="imageGallery" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {images.length === 0 && !loading && <div>No image to display :|</div>}

            {images.map((image) => (
              <div
                key={image.id}
                onClick={(e) => toggleSelect(e, image.id)}
                className={`relative block overflow-hidden rounded border cursor-pointer transition-shadow ${
                  isSelected(image.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                aria-pressed={isSelected(image.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleSelect(e, image.id)
                }}
              >
                <img
                  src={image.urls?.small}
                  alt={image.alt_description || 'Image'}
                  className="w-full h-48 object-cover"
                />

                {/* overlay top-right: view link */}
                <a
                  href={image.links?.html || image.urls?.full}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 bg-white/80 rounded px-2 py-1 text-xs"
                >
                  View
                </a>

                {/* Checkbox / selection badge */}
                <button
                  type="button"
                  onClick={(e) => toggleSelect(e, image.id)}
                  className={`absolute top-2 left-2 rounded-full p-1 flex items-center justify-center text-white text-xs ${
                    isSelected(image.id) ? 'bg-blue-600' : 'bg-black/60'
                  }`}
                >
                  {isSelected(image.id) ? '✓' : '+'}
                </button>

                {/* optional caption */}
                <div className="p-2 text-sm text-gray-700">
                  {image.user?.name}
                </div>
              </div>
            ))}
          </div>

          {images.length > 0 && (
            <div id="pagination" className="flex items-center gap-4 mt-6">
              <button
                id="prevPage"
                type="button"
                onClick={handlePrev}
                disabled={currentPage <= 1 || loading}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage}</span>
              <button
                id="nextPage"
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Top searches + user history side-by-side */}
          <section className="mt-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Top Searches */}
              <div className="w-full md:w-1/2">
                <h2 className="text-lg font-semibold mb-2 text-left">Top Searches</h2>
                <div className="border rounded p-3 bg-white">
                  <ul className="list-decimal list-inside space-y-2 max-h-56 overflow-y-auto">
                    {topSearches && topSearches.length > 0 ? (
                      topSearches
                        .slice() // copy before sorting to avoid mutating state
                        .sort((a, b) => b.frequency - a.frequency)
                        .map((search, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex">
                            <span>{search.term}</span>
                            <span className="text-gray-500 text-xs">({search.frequency})</span>
                          </li>
                        ))
                    ) : (
                      <li className="text-sm text-gray-600">No top searches available</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* User History */}
              <div className="w-full md:w-1/2">
                <h2 className="text-lg font-semibold mb-2 text-left">Your History</h2>
                <div className="border rounded p-3 bg-white">
                  <ul className="space-y-2 max-h-33 overflow-y-auto">
                    {history && history.length > 0 ? (
                      history
                        .slice()
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map((h) => (
                          <li key={h._id} className="text-sm text-gray-700 flex flex-col">
                            <div className="flex items-center">
                              <span className="font-medium">{h.term}</span>
                              <span className="text-gray-500 text-xs">({h.frequency})</span>
                            <div className="text-gray-400 text-xs mt-1">
                              {new Date(h.timestamp).toLocaleString()}
                            </div>
                            </div>
                          </li>
                        ))
                    ) : (
                      <li className="text-sm text-gray-600">No history yet</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Home
