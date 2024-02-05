import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, Spinner } from "flowbite-react";
import ListingCard from "../components/ListingCard";

const Home = () => {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  const carouselTheme = {
    "scrollContainer": {
      "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-none"
    },
    "control": {
      "icon": "h-5 w-5 dark:text-gray-200 text-gray-800 sm:h-6 sm:w-6"
    }
  }

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ROOT}/listing/search?offer=true&limit=4`);
        const data = await res.json();

        if (res.ok) {
          setOfferListings(data);
          fetchRentListings();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ROOT}/listing/search?type=rent&limit=4`);
        const data = await res.json();

        if (res.ok) {
          setRentListings(data);
          fetchSaleListings();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ROOT}/listing/search?type=sell&limit=4`);
        const data = await res.json();

        if (res.ok) {
          setSaleListings(data);
        }
      } catch (error) {
        log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <main className="home-container">
      {/* top */}
      <div className="home-top">
        <h1 className="text-5xl max-sm:text-4xl font-semibold">
          Find Your Next
          <span className="uppercase text-blue-600 dark:text-blue-500 mx-2">perfect</span>
          <br />
          Place Easily!
        </h1>
        <p className="md:text-lg">
          <span className="font-semibold">RealEstate</span> will help you find your home fast, easy and comfortable.
          <br />
          Our expert support are always available.
        </p>
        <Link to="/search" className="link max-sm:text-sm">Let's Start Now..!</Link>
      </div>

      {/* carousel */}
      <div className="h-[240px] sm:h-[320px] md:h-[480px]">
        <Carousel slideInterval={3000} pauseOnHover theme={carouselTheme}>
          <img src="/1.jpg" />
          <img src="/2.jpg" />
          <img src="/3.jpg" />
          <img src="/4.jpg" />
        </Carousel>
      </div>

      {/* listings */}
      <div className="home-bottom">
        {/* offer listing */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Recent Offers</h1>
          <Link className='link mb-2 text-sm' to={'/search?offer=true'}>Show More Offers</Link>
          {
            !offerListings ? <div className='flex justify-center'><Spinner size="xl" /></div>
              :
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {offerListings.map((listing, idx) => <ListingCard key={idx} listing={listing} />)}
              </div>
          }
        </div>

        {/* rent listing */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Recent Places For RENT</h1>
          <Link className='link mb-2 text-sm' to={'/search?type=rent'}>Show More Places For RENT</Link>
          {
            !rentListings ? <div className='flex justify-center'><Spinner size="xl" /></div>
              :
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rentListings.map((listing, idx) => <ListingCard key={idx} listing={listing} />)}
              </div>
          }
        </div>

        {/* sale listing */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Recent Places For SALE</h1>
          <Link className='link mb-2 text-sm' to={'/search?type=sell'}>Show More Places For SALE</Link>
          {
            !saleListings ? <div className='flex justify-center'><Spinner size="xl" /></div>
              :
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {saleListings.map((listing, idx) => <ListingCard key={idx} listing={listing} />)}
              </div>
          }
        </div>
      </div>

    </main>
  )
}

export default Home