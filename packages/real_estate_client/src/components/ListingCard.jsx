import { Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';

const ListingCard = ({ listing, setListings }) => {
  const { token, details: user } = useSelector(state => state.user)
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteListing = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/listing/delete/${listing._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      })
      setLoading(false);

      if (res.ok) {
        setConfirmDelete(false);
        setListings(prev => prev.filter(l => l._id !== listing._id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className='search-card-container'>
      <div className="relative">
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]} alt={listing.title}
            className="rounded-t-lg h-64 sm:h-56 md:h-64 lg:h-56 w-full object-cover hover:scale-105 duration-500"
          />
        </Link>
        {
          user?._id === listing.owner &&
          <div className='absolute top-0 end-0'>
            <div className="flex justify-end w-full pt-1 px-1" >
              <Link to={`/listing/update/${listing._id}`} className='search-card-btn'><MdEdit fontSize={20} /></Link>
              <button className='search-card-btn' onClick={() => setConfirmDelete(true)}> <MdDelete fontSize={20} /></button>

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
            </div>
          </div>
        }
      </div>

      <div className="search-card">
        <div className="flex flex-col gap-2">
          {/* title */}
          <h1 className="mb-2 font-semibold flex flex-col">
            <span className="text-xl text-blue-600 dark:text-blue-500">{listing.title}</span>
            <span className="">
              {listing.offer ? listing.discountPrice : listing.regularPrice} EGP
              {listing.type === 'rent' && ' / Month'}
            </span>
          </h1>

          {/* address */}
          <p className='flex items-center gap-1 text-sm'>
            <FaMapMarkerAlt className='text-green-600 dark:text-green-500' />
            {listing.address}
          </p>
          {/* description */}
          <p className="text-sm line-clamp-2">
            <span className='font-semibold text-gray-600 dark:text-gray-400'>
              {'Description - '}
            </span>
            {listing.description}
          </p>
        </div>

        {/* bedrooms, bathrooms, parking and furnished */}
        <div className='flex gap-x-4 gap-y-2 flex-wrap text-xs text-green-600 dark:text-green-500 font-semibold'>
          <span className='flex items-center gap-1'>
            <FaBed className='text-lg' />
            {listing.bedrooms} Bedroom{listing.bedrooms > 1 && 's'}
          </span>
          <span className='flex items-center gap-1'>
            <FaBath className='text-lg' />
            {listing.bathrooms} Bathroom{listing.bathrooms > 1 && 's'}
          </span>
        </div>
      </div>
    </main>
  )
}

export default ListingCard