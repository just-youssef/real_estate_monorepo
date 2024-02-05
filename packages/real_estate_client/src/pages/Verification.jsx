import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { useSelector } from 'react-redux';

const Verification = () => {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const { id } = useParams();
  const [emailVerified, setEmailVerified] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const resendVerfication = async () => {
    setOpenModal(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/user/verfication/resend/${id}`)
      const data = await res.json();

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const checkEmailVerfication = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/user/verfication/check/${id}`)
      const data = await res.json();

      if (data.verified) {
        setEmailVerified(true)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) navigate('/')
    checkEmailVerfication();
  }, [token])

  return (
    <div className='paper'>
      <div className='text-green-600 dark:text-green-500 flex flex-col items-center gap-5'>
        <FaCheckCircle fontSize={150} />

        <h1 className='flex flex-col'>
          An verfication link was sent to your email, please check your inbox!
          {
            !emailVerified &&
            <button className='link w-fit' onClick={() => setOpenModal(true)}>
              Resend Verfication Link?
            </button>
          }
        </h1>
      </div>

      <Modal popup show={openModal} onClose={() => setOpenModal(false)}>
        <div className="modal-container">
          <Modal.Header />
          <Modal.Body className='modal-body'>
            <h1 className='text-xl mb-8 uppercase text-center'>Please, Confirm re-sending verfication link!</h1>
            <div className='flex gap-2 w-full'>
              <button className='submit w-full' onClick={resendVerfication}>Confirm</button>
              <button className='cancel w-full' onClick={() => setOpenModal(false)}>Cancel</button>
            </div>
          </Modal.Body>
        </div>
      </Modal>

      {
        emailVerified ?
          <>
            <h1 className='uppercase text-green-600 dark:text-green-500 text-xl font-semibold mt-10'>verified</h1>
            <Link
              className='uppercase rounded-full w-full px-3 py-2 
            text-gray-200 bg-green-600 active:bg-green-700
            dark:bg-green-500 dark:active:bg-green-600
            mt-5 text-center'
              to="/sign-in"
            >
              Try Sign In Now
            </Link>
          </>
          :
          <>
            <h1 className='uppercase text-red-600 dark:text-red-500 text-xl font-semibold mt-10'>not verified</h1>
            <button
              className='uppercase rounded-full w-full px-3 py-2 
            text-gray-200 bg-green-600 active:bg-green-700
            dark:bg-green-500 dark:active:bg-green-600
            mt-5'
              onClick={checkEmailVerfication}
            >
              check verfication update
            </button>
          </>
      }
    </div>
  )
}

export default Verification