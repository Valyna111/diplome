
import { BrowserRouter as  Routes, Route } from "react-router-dom";
import UserProfilePage from "@/views/UserProfile/UserProfile";

const UserProfile= () => (

  
      <Routes>
        <Route path="/" element={<UserProfilePage />} />
      </Routes>
 
);
export default UserProfile;
