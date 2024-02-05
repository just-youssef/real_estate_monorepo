import { Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { FaEye, FaEyeSlash, FaCamera, FaCheckCircle } from "react-icons/fa";
import { clearUserData, setUserData } from "../lib/features/userReducer";
import { Link } from "react-router-dom";

const Profile = () => {
  const { token, details: user } = useSelector(state => state.user)
  const dispatch = useDispatch();

  // user data form
  const [formData, setFormData] = useState({});
  const [formDataError, setFormDataError] = useState({});

  // change password form
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({});
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [passwordFormError, setPasswordFormError] = useState({});

  // submit state
  const [loading, setLoading] = useState(false);

  // update state
  const [updated, setUpdated] = useState(false);

  // delete account
  const [confirmDelete, setConfirmDelete] = useState(false);

  // delete account
  const deleteAccount = async()=>{
    setLoading(true);

    try {
      const res = await fetch(`/api/user/delete`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      })
      setLoading(false);

      if(res.ok){
        setConfirmDelete(false);
        dispatch(clearUserData());
      }
    } catch (error) {
      console.log(error);
    }
  }

  // upload image
  const uploadImage = async(e)=>{
    // extarct image from event object
    const avatar = e.target.files[0];
    if (!avatar) return;

    setLoading(true);
    const imageData = new FormData();
    imageData.append('file', avatar, avatar.name);

    try {
      const res = await fetch(`/api/cloudinary/uploadFile`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: imageData,
      })
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setFormData({...formData, avatar: data.url})
      }
    } catch (error) {
      console.log(error);
    }
  }

  // user data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  // submit user form data
  const handleUpdate = async(e) => {
    e.preventDefault();
    setLoading(true);
    setFormDataError({});

    try {
      const res = await fetch(`/api/user/update`, {
        method: "POST",
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) {
        // set errors
        setFormDataError(data.error)
      }

      if (res.status === 200) {
        dispatch(setUserData({ details: data }))
        setUpdated(true)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  // password form change
  const handlePasswordFormChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.id]: e.target.value,
    })
  }

  // submit password form
  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    setPasswordFormError({})

    try {
      const res = await fetch(`/api/user/changePassword`, {
        method: "POST",
        headers: {
          'x-auth-token': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) {
        // set errors
        setPasswordFormError(data.error)
      }

      if (res.status === 200) {
        setOpenModal(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  // close password form
  const closePasswordForm = () => {
    setOpenPasswordForm(false);
    setPasswordFormError({});
  }

  return (
    <div className="paper">
      {/* profile image */}
      <div className="relative mb-5 rounded-full border-gray-400 dark:border-gray-600 border-2">
        <label htmlFor="avatar" className={`rounded-full bg-gray-800 absolute inset-0 ${loading? 'opacity-60' : 'opacity-0 hover:opacity-60 cursor-pointer'}`}>
          <span className="flex justify-center items-center h-full text-gray-200">
            {loading ? <Spinner /> : <span className="flex flex-col items-center"><FaCamera fontSize={18} />Change Profile</span>}
          </span>
        </label>
        <img src={formData.avatar || user.avatar || '/default_profile.png'} alt="avatar" className="h-40 rounded-full w-40 object-cover" />
        <input type="file" onChange={uploadImage} className="hidden" id="avatar" disabled={loading} />
      </div>

      {/* user details form */}
      <form className='flex flex-col w-full gap-2' onSubmit={handleUpdate}>
        {/* first name */}
        <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start">
          <label htmlFor="first_name" className="sm:w-1/4">First Name:</label>
          <div className="flex flex-col w-3/4 max-sm:w-full">
            <input
              type='text' className={'input-bar'}
              placeholder='First Name *' required id="first_name"
              onChange={handleChange}
              defaultValue={user.first_name}
            />
            {
              formDataError.first_name &&
              <small className="text-red-700 ml-3">
                {formDataError.first_name}
              </small>
            }
          </div>
        </div>

        {/* last name */}
        <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start">
          <label htmlFor="last_name" className="sm:w-1/4">Last Name:</label>
          <div className="flex flex-col w-3/4 max-sm:w-full">
            <input
              type='text' className={'input-bar'}
              placeholder='First Name *' required id="last_name"
              onChange={handleChange}
              defaultValue={user.last_name}
            />
            {
              formDataError.last_name &&
              <small className="text-red-700 ml-3">
                {formDataError.last_name}
              </small>
            }
          </div>
        </div>

        {/* email */}
        <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start">
          <label htmlFor="email" className="sm:w-1/4">Email:</label>
          <div className="flex flex-col w-3/4 max-sm:w-full">
            <input
              type='email' className={'input-bar'}
              placeholder='Email *' required id="email"
              onChange={handleChange}
              defaultValue={user.email}
            />
            {
              formDataError.email &&
              <small className="text-red-700 ml-3">
                {formDataError.email}
              </small>
            }
          </div>
        </div>

        {/* submit button */}
        <button className='submit mt-2' disabled={loading}>
          {loading ? <Spinner /> : 'Update Profile'}
        </button>

        {/* update state */}
        {
          updated &&
          <p className="text-green-600 dark:text-green-500 flex items-center">
            <FaCheckCircle className="pr-1" fontSize={18} />Profile updated successfully!
          </p>
        }
      </form>

      {/* gallery button */}
      <Link to="/listing/gallery" className='gallery w-full mt-2' disabled={loading}>
        {loading ? <Spinner /> : 'Show Listing Gallery'}
      </Link>

      {/* trigger change password form button */}
      <div className="flex justify-start w-full mt-4">
        <button type="button" disabled={loading} className='link' onClick={() => setOpenPasswordForm(true)}>Change Password?</button>
      </div>
      
      {/* change password form */}
      <Modal popup show={openPasswordForm} onClose={closePasswordForm} position="center">
        <div className="modal-container">
          <Modal.Header />
          <Modal.Body className='modal-body'>
            <h1 className='text-xl mb-5 uppercase'>change password</h1>
            <form className='flex flex-col gap-2 w-full' onSubmit={changePassword}>
              {/* old password */}
              <div className='w-full'>
                <div className='relative'>
                  <input type={showPassword.old ? 'text' : 'password'}
                    className={passwordFormError.old_password ? `input-bar-error w-full` : 'input-bar w-full'}
                    placeholder='Old Password *' required id="old_password"
                    onChange={handlePasswordFormChange}
                  />
                  <button type='button' className='p-1 absolute inset-y-0 end-2.5'
                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}>
                    {
                      showPassword.old ?
                        <FaEye className={passwordFormError.old_password ? 'icon-error text-lg' : 'icon text-lg'} />
                        :
                        <FaEyeSlash className={passwordFormError.old_password ? 'icon-error text-lg' : 'icon text-lg'} />
                    }
                  </button>
                </div>
                {passwordFormError.old_password && <small className='text-red-700 ml-3'>{passwordFormError.old_password}</small>}
              </div>

              {/* new password */}
              <div className='w-full'>
                <div className='relative'>
                  <input type={showPassword.new ? 'text' : 'password'}
                    className={passwordFormError.new_password ? `input-bar-error w-full` : 'input-bar w-full'}
                    placeholder='New Password *' required id="new_password"
                    onChange={handlePasswordFormChange}
                  />
                  <button type='button' className='p-1 absolute inset-y-0 end-2.5'
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                    {
                      showPassword.new ?
                        <FaEye className={passwordFormError.new_password ? 'icon-error text-lg' : 'icon text-lg'} />
                        :
                        <FaEyeSlash className={passwordFormError.new_password ? 'icon-error text-lg' : 'icon text-lg'} />
                    }
                  </button>
                </div>
                {
                  passwordFormError.new_password &&
                  <small className='text-red-700 ml-3 flex flex-col'>
                    {passwordFormError.new_password}
                    {
                      !passwordFormError.same &&
                      <ol className='list-decimal ml-4'>
                        <li>must be 8 chars length at least</li>
                        <li>must contain 1 letter at least</li>
                        <li>must contain 1 digit at least</li>
                      </ol>
                    }
                  </small>
                }
              </div>

              {/* confirm new password */}
              <div className='w-full'>
                <div className='relative'>
                  <input type={showPassword.confirm ? 'text' : 'password'}
                    className={passwordFormError.confirm_new_password ? `input-bar-error w-full` : 'input-bar w-full'}
                    placeholder='Confirm New Password *' required id="confirm_new_password"
                    onChange={handlePasswordFormChange}
                  />
                  <button type='button' className='p-1 absolute inset-y-0 end-2.5'
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                    {
                      showPassword.confirm ?
                        <FaEye className={passwordFormError.confirm_new_password ? 'icon-error text-lg' : 'icon text-lg'} />
                        :
                        <FaEyeSlash className={passwordFormError.confirm_new_password ? 'icon-error text-lg' : 'icon text-lg'} />
                    }
                  </button>
                </div>
                {passwordFormError.confirm_new_password && <small className='text-red-700 ml-3'>{passwordFormError.confirm_new_password}</small>}
              </div>

              {/* submit change password */}
              <div className="flex mt-2 gap-2 justify-center">
                {loading ? <Spinner />
                  :
                  <>
                    <button type='submit' className='submit w-full'>Confirm</button>
                    <button type="button" className='cancel w-full' onClick={closePasswordForm}>Cancel</button>
                  </>
                }
              </div>
            </form>
          </Modal.Body>
        </div>
      </Modal>

      {/* sign out */}
      <button className="cancel mt-10 w-full" onClick={() => dispatch(clearUserData())} disabled={loading}>
        {loading ? <Spinner /> : 'sign out'}
      </button>

      {/* delete account */}
      <button className="delete mt-2 w-full" onClick={() => setConfirmDelete(true)} disabled={loading}>
        {loading ? <Spinner /> : 'delete account'}
      </button>
      <Modal popup show={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <div className="modal-container">
          <Modal.Header />
          <Modal.Body className='modal-body'>
            <h1 className='text-xl mb-8 uppercase text-center'>Are you sure you want to delete your account?</h1>
            {
              loading ? <Spinner />
                :
                <div className='flex gap-2 w-full'>
                  <button className='delete w-full' onClick={deleteAccount}>Confirm Delete</button>
                  <button className='cancel w-full' onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
            }
          </Modal.Body>
        </div>
      </Modal>
    </div>
  )
}

export default Profile