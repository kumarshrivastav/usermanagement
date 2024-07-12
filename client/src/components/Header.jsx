
import { Avatar, Button, Dropdown, Navbar,Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate} from "react-router-dom";
import { logout } from "../services/http";
import { toast } from 'react-toastify';
import { logoutLoading, logoutSuccess } from "../store/userSlice";

function Header() {
  const dispatch=useDispatch()
  const {user}=useSelector(state=>state.user)
  // console.log(user.avatar)
  const nav=useNavigate()
  const handleLogout=async()=>{
    try {
      dispatch(logoutLoading())
      const {data}=await logout()
      toast.success(data)
      window.localStorage.clear()
      dispatch(logoutSuccess())
      nav("/signin")
    } catch (error) {
      toast.error(error.response.data.message)
      dispatch
    }
  }
  return (
    <Navbar fluid rounded>
      <Navbar.Collapse>
        <Navbar.Link active>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link><Link to={'/about'}>About</Link></Navbar.Link>
        <Navbar.Link><Link to={'/about'}>Service</Link></Navbar.Link>
        <Navbar.Link><Link to={'/about'}>Contact</Link></Navbar.Link>
      </Navbar.Collapse>
      <Navbar.Toggle />
     <div className="flex md:order-2">
        {
          user ?(<Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={user?.avatar} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.firstName}&nbsp;{user?.lastName}</span>
              <span className="block truncate text-sm font-medium">{user?.email}</span>
            </Dropdown.Header>
            <Dropdown.Item><Link to={`/profile/${user?._id}`}>Profile</Link></Dropdown.Item>
            <Dropdown.Divider />
            {
              user?.isAdmin && (
                <Dropdown.Item><Link to={`/dashboard/${user?._id}`}>Dashboard</Link></Dropdown.Item>
              )
            }
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
          ):(<Button outline gradientDuoTone={'tealToLime'}><Link to={'/signin'}>SignIn</Link></Button>)
        }
      </div>
    </Navbar>
  );
}

export default Header