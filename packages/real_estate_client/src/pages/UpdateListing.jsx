import { useEffect, useState } from 'react';
import { ListingForm } from '../components'
import { useParams } from "react-router-dom"
import { Spinner } from 'flowbite-react';
import { useSelector } from 'react-redux';

const UpdateListing = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const getListingDetails = async () => {
            try {
                const res = await fetch(`/api/listing/${id}`);
                const data = await res.json();

                if(res.ok) setListing(data)
            } catch (error) {
                console.log(error);
            }
        }

        getListingDetails();
    }, [id])

    const handleUpdate = async (bodyData) => {
        try {
            const res = await fetch(`/api/listing/update/${id}`, {
                method: "PUT",
                headers: {
                    'x-auth-token': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData),
            });
            const data = await res.json();

            return [res, data];
        } catch (error) {
            console.log(error);
        }
    }

    if(!listing) return <div className='flex justify-center m-5'><Spinner size="xl" /></div>

    return <ListingForm listing={listing} handleFormAction={handleUpdate} />
}

export default UpdateListing