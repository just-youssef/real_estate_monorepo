import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from 'flowbite-react';

const SignUp = () => {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({value: false, confirm: false});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [firstNameError, setFirstNameError] = useState({ value: false, msg: "" });
  const [lastNameError, setLastNameError] = useState({ value: false, msg: "" });
  const [emailError, setEmailError] = useState({ value: false, msg: "" });
  const [passwordError, setPasswordError] = useState({ value: false, msg: "" });
  const [confirmPasswordError, setConfirmPasswordError] = useState({ value: false, msg: "" });

  useEffect(()=>{
    if (token) navigate('/')
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  
  const handleSignUp = async(e) => {
    e.preventDefault();
    setLoading(true);

    // reset errors
    setError({});

    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/user/signup`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        // set errors
        setError(data.error);
      }
      if (res.status === 201) {
        navigate(`/verification/${data.userID}`)
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='paper'>
      <img src='/logo.png' className='w-28 mb-5' />
      <h1 className='text-2xl font-semibold mb-5'>Sign Up to
        <span className="text-gray-500 dark:text-gray-400"> Real</span>
        Estate
      </h1>

      <form className='w-full flex flex-col gap-2' onSubmit={handleSignUp}>
        <div className='flex gap-2'>
          <div className='w-full'>
            {/* first name */}
            <input
              type='text' className={error.first_name ? `input-bar-error w-full` : 'input-bar w-full'}
              placeholder='First Name *' required id="first_name" onChange={handleChange}
            />
            {error.first_name && <small className='text-red-700 ml-3'>{error.first_name}</small>}
          </div>

          {/* last name */}
          <div className='w-full'>
            <input
              type='text' className={error.last_name ? `input-bar-error w-full` : 'input-bar w-full'}
              placeholder='Last Name *' required id="last_name" onChange={handleChange}
            />
            {error.last_name && <small className='text-red-700 ml-3'>{error.last_name}</small>}
          </div>
        </div>

        {/* email */}
        <div className='w-full'>
          <input
            type='email' className={error.email ? `input-bar-error w-full` : 'input-bar w-full'}
            placeholder='Email *' required id="email" onChange={handleChange}
          />
          {error.email && <small className='text-red-700 ml-3'>{error.email}</small>}
        </div>

        {/* password */}
        <div className='w-full'>
          <div className='relative'>
            <input
              type={showPassword.value ? 'text' : 'password'}
              className={error.password ? `input-bar-error w-full` : 'input-bar w-full'}
              placeholder='Password *' required id="password" onChange={handleChange}
            />
            <button
              type='button' className='p-1 absolute inset-y-0 end-2.5'
              onClick={() => setShowPassword({ ...showPassword, value: !showPassword.value })}>
              {
                showPassword.value ?
                  <FaEye className={error.password ? 'icon-error text-lg' : 'icon text-lg'} />
                  :
                  <FaEyeSlash className={error.password ? 'icon-error text-lg' : 'icon text-lg'} />
              }
            </button>
          </div>
          {
            error.password &&
            <small className='text-red-700 ml-3 flex flex-col'>
              {error.password}
              <ol className='list-decimal ml-4'>
                <li>must be 8 chars length at least</li>
                <li>must contain 1 letter at least</li>
                <li>must contain 1 digit at least</li>
              </ol>
            </small>
          }
        </div>

        {/* confirm password */}
        <div className='w-full'>
          <div className='relative'>
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              className={error.confirm_password ? `input-bar-error w-full` : 'input-bar w-full'}
              placeholder='Confirm Password *' required id="confirm_password" onChange={handleChange}
            />
            <button
              type='button' className='p-1 absolute inset-y-0 end-2.5'
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
            >
              {
                showPassword.confirm ?
                  <FaEye className={error.confirm_password ? 'icon-error text-lg' : 'icon text-lg'} />
                  :
                  <FaEyeSlash className={error.confirm_password ? 'icon-error text-lg' : 'icon text-lg'} />
              }
            </button>
          </div>
          {error.confirm_password && <small className='text-red-700 ml-3'>{error.confirm_password}</small>}
        </div>

        <button type='submit' className='mt-2 submit' disabled={loading}>
          {loading ? <Spinner /> : 'Sign Up'}
        </button>

        <p className='mt-4'>Already have an account?
          <Link to="/sign-in">
            <span className='link ml-1'>Sign In</span>
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp