import { Bell } from "lucide-react"; 
import { getUser } from "../utils/getUser";


const Navbar = () => {
    

const user = getUser()
//   console.log(user);
  
    const handleLogout = () => {
    localStorage.removeItem('user');
   alert("Successfully Logged Out");
    window.location.href = '/'; 
  };

  return (
    <nav className="w-full h-16 bg-slate-200 shadow  flex items-center justify-end px-6">
      <button className="mr-6 relative">
        <Bell className="h-6 w-6 text-gray-600 hover:text-gray-800" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-2 h-2 flex items-center justify-center rounded-full">
          
        </span>
      </button>

{    user &&  <div className="flex items-center gap-3 hover:bg-amber-50 px-3 py-1 rounded-2xl cursor-pointer" title="Logout" onClick={handleLogout}>
        <img
          src={user?.profileImage}
          alt="User"
          className="w-8 h-8 rounded-full border"
        />
        <span className="text-gray-700 font-medium">{user?.role}</span>
      </div>}
    </nav>
  );
}
export default Navbar
