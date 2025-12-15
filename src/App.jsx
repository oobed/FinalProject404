import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './components/Layout'
import Home from './pages/Home'
import Songs from './pages/Songs'
import SongDetail from './pages/SongDetail'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import AddReview from './pages/AddReview'
import EditReview from './pages/EditReview'
import ReviewDetail from './pages/ReviewDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="songs" element={<Songs />} />
          <Route path="songs/:songId" element={<SongDetail />} />
          <Route path="albums" element={<Albums />} />
          <Route path="albums/:albumId" element={<AlbumDetail />} />
          <Route path="add-review" element={<AddReview />} />
          <Route path="reviews/:reviewId" element={<ReviewDetail />} />
          <Route path="reviews/:reviewId/edit" element={<EditReview />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
