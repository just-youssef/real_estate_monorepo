import { DarkThemeToggle, Dropdown } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { clearUserData } from '../lib/features/userReducer';
import { IoPerson } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { useEffect, useState } from 'react';

const Header = () => {
  const { token, details: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const signout = () => {
    dispatch(clearUserData());
  };

  const handleSearch = (e) => {
    e.preventDefault()

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  return (
    <div className='nav-paper'>
      <div className='flex items-center justify-between py-2 w-11/12 max-w-6xl mx-auto'>
        <Link to="/" className=''>
          <div className='flex items-end font-semibold'>
            <img src="/logo.png" className="min-w-8 w-9" alt="Logo" />
            <span className="text-xl text-gray-500 dark:text-gray-400 max-sm:hidden ml-2">Real</span>
            <span className="text-xl max-sm:hidden">Estate</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className='relative max-sm:mx-2 max-sm:flex-grow sm:w-64 lg:w-96'>
          <input
            type="text" className='input-bar w-full text-sm' placeholder='Search..'
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className='absolute inset-y-0 end-1 flex items-center'>
            <button className='search-btn'>
              <FaSearch className='icon' />
            </button>
          </div>
        </form>

        <div className='flex items-center'>
          <DarkThemeToggle className='rounded-full hover:bg-gray-300 focus:ring-0 p-2' />
          {
            token ?
              <>
                <Link to="/listing/create" className='nav-btn text-sm max-md:hidden flex items-center gap-1.5'>
                  <FaPlus />Create New Listing
                </Link>
                <Dropdown
                  renderTrigger={() => <img src={user.avatar || '/default_profile.png'} className='cursor-pointer h-9 w-9 rounded-full object-cover ml-1' />}
                >
                  <Dropdown.Item as={Link} to="/listing/create" className='flex justify-between items-center w-full gap-2 md:hidden'>
                    Create New Listing <FaPlus />
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile" className='flex items-center justify-between gap-2 w-full'>
                    {`${user.first_name} ${user.last_name}`}<IoPerson fontSize={16} />
                  </Dropdown.Item>
                  <Dropdown.Item onClick={signout} className='flex items-center justify-between gap-2 w-full'>
                    Sign Out <PiSignOutBold fontSize={18} />
                  </Dropdown.Item>
                </Dropdown>
              </>
              :
              <>
                {/* large screen */}
                <div className='flex items-center max-md:hidden'>
                  <Link to="/sign-in">
                    <button className='nav-btn text-sm'>
                      Sign In
                    </button>
                  </Link>
                  <span className='text-sm text-gray-400 dark:text-gray-600 mx-1'>OR</span>
                  <Link to="/sign-up">
                    <button className='nav-btn text-sm'>
                      Sign Up
                    </button>
                  </Link>
                </div>

                {/* small screen */}
                <Dropdown renderTrigger={() => <span className='p-2 nav-btn md:hidden cursor-pointer focus:bg-gray-50'><IoIosArrowDown fontSize={18} className='icon' /></span>}>
                  <Dropdown.Item as={Link} to="/sign-in">Sign In</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/sign-up">Sign Up</Dropdown.Item>
                </Dropdown>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export default Header