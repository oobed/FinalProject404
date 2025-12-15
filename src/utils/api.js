const API_BASE_URL = 'http://localhost:3001'

// fetch function with error handling
async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`)
  }
  return response.json()
}

// POST function
async function postData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to post data to ${endpoint}`)
  }
  return response.json()
}

// PUT function
async function putData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to update data at ${endpoint}`)
  }
  return response.json()
}

// DELETE function
async function deleteData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete data at ${endpoint}`)
  }
  return response.json()
}

// Songs API
export const getSongs = () => fetchData('/songs')
export const getSong = id => fetchData(`/songs/${id}`)

// Albums API
export const getAlbums = () => fetchData('/albums')
export const getAlbum = id => fetchData(`/albums/${id}`)


// Reviews API
export const getReviews = () => fetchData('/reviews')
export const getReview = id => fetchData(`/reviews/${id}`)
export const getReviewsBySong = songId => fetchData(`/reviews?songId=${songId}`)
export const createReview = reviewData => postData('/reviews', reviewData)
export const updateReview = (id, reviewData) => putData(`/reviews/${id}`, reviewData)
export const deleteReview = id => deleteData(`/reviews/${id}`)


// Comments API
export const getComments = () => fetchData('/comments')
export const getCommentsBySong = songId =>
  fetchData(`/comments?songId=${songId}`)
export const createComment = commentData => postData('/comments', commentData)
export const deleteComment = id => deleteData(`/comments/${id}`)


// Users API
export const getUsers = () => fetchData('/users')
export const getUser = id => fetchData(`/users/${id}`)
