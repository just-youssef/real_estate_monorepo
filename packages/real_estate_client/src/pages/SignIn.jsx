import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from '../lib/features/userReducer';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';

const SignIn = () => {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(()=>{
    if (token) navigate('/')
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSignIn = async(e) => {
    e.preventDefault();
    setLoading(true);

    // reset errors
    setError({});

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/user/signin`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const user = await res.json();
      setLoading(false);

      if (user.error) {
        // set errors
        setError(user.error)
      }
      if (res.status === 200) {
        if (!user.details.verified) {
          navigate(`/verification/${user.details._id}`)
        }
        else {
          dispatch(setUserData(user))
        }
      }
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <div className='paper'>
      <img src='/logo.png' className='w-28 mb-5' />
      <h1 className='text-2xl font-semibold mb-5'>Sign In to
        <span className="text-gray-500 dark:text-gray-400"> Real</span>
        Estate
      </h1>

      <form className='w-full flex flex-col gap-2' onSubmit={handleSignIn}>
      <div className='w-full'>
          <input type='email' className={error.email?`input-bar-error w-full`:'input-bar w-full'} placeholder='Email *' required id="email" onChange={handleChange} />
          {error.email && <small className='text-red-700 ml-3'>{error.email}</small>}
        </div>

        <div className='w-full'>
          <div className='relative'>
            <input type={showPassword ? 'text' : 'password'} className={error.password?`input-bar-error w-full`:'input-bar w-full'} placeholder='Password *' required id="password" onChange={handleChange} />
            <button type='button' className='p-1 absolute inset-y-0 end-2.5'
              onClick={() => setShowPassword(!showPassword)}>
              {
                showPassword ?
                  <FaEye className={error.password ? 'icon-error text-lg' : 'icon text-lg'} />
                  :
                  <FaEyeSlash className={error.password ? 'icon-error text-lg' : 'icon text-lg'} />
              }
            </button>
          </div>
          {error.password && <small className='text-red-700 ml-3'>{error.password}</small>}
        </div>

        <button type='submit' className='mt-2 submit' disabled={loading}>
          {
            loading? <Spinner /> : 'Sign In'
          }
        </button>

        <p className='mt-4'>Don't have an account?
          <Link to="/sign-up">
            <span className='link ml-1'>Sign Up</span>
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignIn