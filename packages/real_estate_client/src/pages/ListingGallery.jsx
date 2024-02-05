import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { ListingCard } from "../components";

const ListingGallery = () => {
    const [listings, setListings] = useState(null);
    const { token, details: user } = useSelector((state) => state.user);

    useEffect(() => {
        const getUserListings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_ROOT}/listing/me`, {
                    headers: {
                        "x-auth-token": token
                    }
                });
                const data = await res.json();

                if (res.ok) setListings(data)
            } catch (error) {
                console.log(error);
            }
        }

        getUserListings();
    }, [token])

    if (!listings) return <div className='flex justify-center m-5'><Spinner size="xl" /></div>
    if (listings.length == 0) return <div className='flex justify-center m-10 text-gray-500 text-3xl font-semibold'>Your Listing Gallery is Empty</div>

    return (
        <main className="my-8 mx-auto w-11/12 max-w-6xl text-gray-900 dark:text-gray-200">
            <h1 className="text-center text-3xl max-sm:text-2xl mb-5 font-semibold">
                <span className="text-gray-500">{user.first_name}{" "}{user.last_name}{" "}</span>
                Listings Gallery
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.map((listing, idx) => <ListingCard key={idx} listing={listing} setListings={setListings} />)}
            </div>
        </main>
    )
}

export default ListingGallery