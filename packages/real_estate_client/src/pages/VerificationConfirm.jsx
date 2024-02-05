import { Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

const VerificationConfirm = () => {
  const userToken = useSelector((state) => state.user.token)
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirmIdentity = async () => {
    setLoading(true);
    try {
        const res = await fetch(`/api/user/verify/${id}/${token}`)
        const data = await res.json();
        setLoading(false);

        if (data.verified) {
          setEmailVerified(true)
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    if (userToken) navigate('/')
    if (emailVerified) navigate('/sign-in')

    const checkEmailVerfication = async () => {
      try {
        const res = await fetch(`/api/user/verfication/check/${id}`)
        const data = await res.json();

        if (data.verified) {
          setEmailVerified(true)
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkEmailVerfication();
  }, [userToken, emailVerified])

  return (
    <div className="paper">
      <img src='/logo.png' className='h-24 mb-5' />
      <h1 className='text-2xl font-semibold mb-5 text-center'>
        <span className="text-gray-500 dark:text-gray-400"> Real</span>
        Estate asks to confirm your indentity
      </h1>

      <div className='flex justify-center gap-2 w-full mt-5 '>
        {
          loading ? <Spinner size="lg" />
            :
            <>
              <button className='submit w-full' onClick={confirmIdentity}>Confirm</button>
              <button className='cancel w-full' onClick={() => navigate('/')}>Cancel</button>
            </>
        }
      </div>
    </div>
  )
}

export default VerificationConfirm