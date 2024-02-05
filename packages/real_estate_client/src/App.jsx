import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Private, NotFound } from './components';
import { CreateListing, Home, ListingDetails, ListingGallery, Profile, Search, SignIn, SignUp, UpdateListing, Verification, VerificationConfirm } from './pages'

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verification/:id" element={<Verification />} />
        <Route path="/verification-confirm/:id/:token" element={<VerificationConfirm />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/search" element={<Search />} />
        <Route element={<Private />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/listing/create" element={<CreateListing />} />
          <Route path="/listing/update/:id" element={<UpdateListing />} />
          <Route path="/listing/gallery" element={<ListingGallery />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App