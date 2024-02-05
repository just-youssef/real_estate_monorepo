import { useSelector } from 'react-redux';
import { ListingForm } from '../components'

const CreateListing = () => {
    const token = useSelector((state) => state.user.token);

    const handleCreate = async (bodyData) => {
        try {
            const res = await fetch(`/api/listing/create`, {
                method: "POST",
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

    return (
        <ListingForm handleFormAction={handleCreate} />
    )
}

export default CreateListing