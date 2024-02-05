import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [message, setMessage] = useState('');

  return (
    <div className='flex flex-col gap-2 w-full mt-4'>
      <h1 className='text-lg w-full'>
        Contact
        <span className="text-blue-600 dark:text-blue-500 font-semibold mx-1">{listing.owner.first_name} {listing.owner.last_name}</span>
        for
        <span className="text-blue-600 dark:text-blue-500 font-semibold mx-1">{listing.title}</span>
        listing
      </h1>
      <textarea
        name='message'
        id='message'
        rows='3'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Enter your message here...'
        className='input-box w-full'
      />
      <Link
        to={`mailto:${listing.owner.email}?subject=Regarding ${listing.title}&body=${message}`}
        className='submit w-full mt-2'
      >
        Send Massege
      </Link>
    </div>
  );
}