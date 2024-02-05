import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { FaSearch } from "react-icons/fa";
import { Spinner } from 'flowbite-react';

const Search = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    sort: "createdAt",
    order: "desc"
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || searchTermFromUrl === "") setSearchData({ ...searchData, searchTerm: searchTermFromUrl })
    if (typeFromUrl) setSearchData({ ...searchData, type: typeFromUrl })
    if (parkingFromUrl) setSearchData({ ...searchData, parking: parkingFromUrl })
    if (furnishedFromUrl) setSearchData({ ...searchData, furnished: furnishedFromUrl })
    if (offerFromUrl) setSearchData({ ...searchData, offer: offerFromUrl })
    if (sortFromUrl) setSearchData({ ...searchData, sort: sortFromUrl })
    if (orderFromUrl) setSearchData({ ...searchData, order: orderFromUrl })

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();

      try {
        const res = await fetch(`/api/listing/search?${searchQuery}`);
        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          setListings(data);
          if (data.length > 5) setShowMore(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sell'].includes(e.target.id)) {
      setSearchData({
        ...searchData,
        type: e.target.id
      });
    }

    if (e.target.id === 'searchTerm') {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSearchData({
        ...searchData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSearchData({ ...searchData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchData.searchTerm || searchData.searchTerm === "") urlParams.set('searchTerm', searchData.searchTerm);
    if (searchData.type) urlParams.set('type', searchData.type);
    if (searchData.parking) urlParams.set('parking', Boolean(searchData.parking));
    if (searchData.furnished) urlParams.set('furnished', Boolean(searchData.furnished));
    if (searchData.offer) urlParams.set('offer', Boolean(searchData.offer));
    if (searchData.sort) urlParams.set('sort', searchData.sort);
    if (searchData.order) urlParams.set('order', searchData.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();

    setMoreLoading(true);
    setShowMore(false);
    try {
      const res = await fetch(`/api/listing/search?${searchQuery}`);
      const data = await res.json();
      setMoreLoading(false);

      if (res.ok) {
        setListings([...listings, ...data]);
        if (data.length > 5) setShowMore(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className='search-container'>
      <form onSubmit={handleSubmit} className='search-paper'>
        {/* search bar */}
        <div className='relative w-full'>
          <input
            type="text" className='input-bar w-full text-sm' placeholder='Search..'
            value={searchData.searchTerm} onChange={handleChange} id='searchTerm'
          />
          <div className='absolute inset-y-0 end-1 flex items-center'>
            <button className='search-btn'>
              <FaSearch className='icon' />
            </button>
          </div>
        </div>

        {/* type */}
        <div className='flex flex-col w-full'>
          <p className='font-semibold text-blue-600 dark:text-blue-500 text-lg'>Type:</p>
          <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1'>
            {/* rent & sale */}
            <div className='flex gap-1 items-center'>
              <input type="checkbox" className='checkbox' id='all' onChange={handleChange} checked={searchData.type === 'all'} />
              <label htmlFor='all'>Rent & Sale</label>
            </div>
            {/* rent */}
            <div className='flex gap-1 items-center'>
              <input type="checkbox" className='checkbox' id='rent' onChange={handleChange} checked={searchData.type === 'rent'} />
              <label htmlFor='rent'>Rent</label>
            </div>
            {/* sale */}
            <div className='flex gap-1 items-center'>
              <input type="checkbox" className='checkbox' id='sell' onChange={handleChange} checked={searchData.type === 'sell'} />
              <label htmlFor='sell'>Sale</label>
            </div>
          </div>
        </div>

        {/* amenities */}
        <div className='flex flex-col w-full'>
          <p className='font-semibold text-blue-600 dark:text-blue-500 text-lg'>Amenities:</p>
          <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1'>
            {/* offer */}
            <div className='flex gap-1 items-center'>
              <input type="checkbox" className='checkbox' id='offer' onChange={handleChange} checked={searchData.offer || false} />
              <label htmlFor='offer'>Offer</label>
            </div>
            {/* parking */}
            <div className='flex gap-1 items-center'>
              <input type="checkbox" className='checkbox' id='parking' onChange={handleChange} checked={searchData.parking || false} />
              <label htmlFor='parking'>Parking</label>
            </div>
            {/* furnished */}
            <div className='flex gap-1 items-center'>
              <input type="checkbox" className='checkbox' id='furnished' onChange={handleChange} checked={searchData.furnished || false} />
              <label htmlFor='furnished'>Furnished</label>
            </div>
          </div>
        </div>

        {/* sorting & order */}
        <div className='flex flex-col w-full'>
          <label htmlFor='sort_order' className='font-semibold text-blue-600 dark:text-blue-500 text-lg'>Sort:</label>
          <select
            onChange={handleChange}
            value={`${searchData.sort}_${searchData.order}`}
            id='sort_order'
            className='input-bar'
          >
            <option value='createdAt_desc'>Latest</option>
            <option value='createdAt_asc'>Oldest</option>
            <option value='regularPrice_desc'>Highest Price</option>
            <option value='regularPrice_asc'>Lowest Price</option>
          </select>
        </div>

        {/* submit button */}
        <button className='submit w-full'>Search Listing</button>
      </form>

      <div className='w-full md:w-2/3 lg:w-3/4 flex flex-col gap-2'>
        <h1 className='text-xl text-gray-600 dark:text-gray-500 font-semibold'>Search Results:</h1>
        {
          loading ? <div className='flex justify-center'><Spinner size="xl" /></div>
            :
            (
              listings.length === 0 ? <h1 className='text-lg text-center font-semibold text-blue-600 dark:text-blue-500'>No Listings Found!</h1>
                :
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {listings.map((listing, idx) => <ListingCard key={idx} listing={listing} />)}
                </div>
            )
        }

        {/* show more */}
        {moreLoading && <div className='flex justify-center'><Spinner size="xl" /></div>}
        {showMore && (
          <div className='flex justify-center'>
            <button
              onClick={onShowMoreClick}
              className='link'
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Search;
