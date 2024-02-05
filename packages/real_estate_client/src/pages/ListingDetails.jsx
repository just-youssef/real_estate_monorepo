import { Carousel, Modal, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom"
import { MdEdit, MdDelete } from "react-icons/md";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import { Contact } from "../components";

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { token, details: user } = useSelector(state => state.user)
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [contact, setContact] = useState(false);

  const carouselTheme = {
    "scrollContainer": {
      "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-none"
    },
    "control": {
      "icon": "h-5 w-5 dark:text-gray-200 text-gray-800 sm:h-6 sm:w-6"
    }
  }

  useEffect(() => {
    const getListingDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ROOT}/listing/${id}`);
        const data = await res.json();

        if (res.ok) setListing(data)
      } catch (error) {
        console.log(error);
      }
    }

    getListingDetails();
  }, [id])

  const deleteListing = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/listing/delete/${listing._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      })
      setLoading(false);

      if (res.ok) {
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!listing) return <div className='flex justify-center m-5'><Spinner size="xl" /></div>

  return (
    <main className="flex flex-col">
      <div className="h-64 sm:h-72 md:h-80 lg:h-96">
        <Carousel slideInterval={3000} pauseOnHover theme={carouselTheme}>
          {listing.imageUrls.map((url, idx) => <img key={idx} src={url} />)}
        </Carousel>
      </div>

      <div className="details-paper">
        {/* edit and delete buttons */}
        {
          token && user?._id === listing.owner._id ?
            <div className='flex justify-end items-center w-full pt-4 px-2'>
              <Link to={`/listing/update/${listing._id}`} className='card-btn'><MdEdit fontSize={24} /></Link>
              <button className='card-btn' onClick={() => setConfirmDelete(true)}> <MdDelete fontSize={24} /></button>

              <Modal popup show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="modal-container">
                  <Modal.Header />
                  <Modal.Body className='modal-body'>
                    <h1 className='text-xl mb-8 text-center'>
                      Are you sure you want to delete
                      <span className="text-blue-600 dark:text-blue-500 font-semibold px-2" >{listing.title}</span>
                      listing ?
                    </h1>
                    {
                      loading ? <Spinner />
                        :
                        <div className='flex gap-2 w-full'>
                          <button className='delete w-full' onClick={deleteListing}>Confirm Delete</button>
                          <button className='cancel w-full' onClick={() => setConfirmDelete(false)}>Cancel</button>
                        </div>
                    }
                  </Modal.Body>
                </div>
              </Modal>
            </div> : <div className="pt-12" />
        }
        <div className="px-8 max-sm:px-6 w-full" >
          {/* title and price */}
          <h1 className="text-2xl max-sm:text-xl mb-6">
            <span className="text-blue-600 dark:text-blue-500 font-semibold">{listing.title}</span>
            {' - '}
            {listing.offer ? listing.discountPrice : listing.regularPrice} EGP
            {listing.type === 'rent' && ' / Month'}
          </h1>

          {/* location */}
          <p className='flex items-center gap-1'>
            <FaMapMarkerAlt className='text-green-600 dark:text-green-500' />
            {listing.address}
          </p>

          {/* type and offer */}
          <div className='flex gap-2 mt-2 w-full sm:w-2/3 md:w-1/2'>
            <p className='bg-red-800 dark:bg-red-900 w-1/2 text-gray-200 p-1 rounded-md flex items-center justify-center'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </p>
            {listing.offer && (
              <p className='bg-green-800 dark:bg-green-900 w-1/2 text-gray-200 p-1 rounded-md flex items-center justify-center text-center'>
                {Math.round((+listing.regularPrice - +listing.discountPrice) / +listing.regularPrice * 100)}% Discount
              </p>
            )}
          </div>

          {/* description */}
          <p className="mt-4">
            <span className='font-semibold text-gray-600 dark:text-gray-400'>
              {'Description - '}
            </span>
            {listing.description}
          </p>

          {/* bedrooms, bathrooms, parking and furnished */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-y-2 text-green-600 dark:text-green-500 font-semibold text-sm mt-4'>
            <span className='flex items-center gap-1'>
              <FaBed className='text-lg' />
              {listing.bedrooms} Bedroom{listing.bedrooms > 1 && 's'}
            </span>
            <span className='flex items-center gap-1'>
              <FaBath className='text-lg' />
              {listing.bathrooms} Bathroom{listing.bathrooms > 1 && 's'}
            </span>
            <span className='flex items-center gap-1'>
              <FaParking className='text-lg' />
              {listing.parking ? 'Parking' : 'No Parking'}
            </span>
            <span className='flex items-center gap-1'>
              <FaChair className='text-lg' />
              {listing.furnished ? 'Furnished' : 'Unfurnished'}
            </span>
          </div>

          {/* contact landlord */}
          {
            token && listing.owner._id !== user?._id &&
            (
              contact ? <Contact listing={listing} />
                :
                <button
                  onClick={() => setContact(true)}
                  className='submit w-full mt-6'
                >
                  Contact landlord
                </button>
            )
          }
        </div>
      </div>
    </main>
  )
}

export default ListingDetails