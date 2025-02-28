import { Routes, Route } from "react-router-dom";
import UserProfilePage from "@/views/UserProfile/UserProfile";

const UserProfile= () => (
      <Routes>
        <Route index element={<UserProfilePage />} />
      </Routes>
);
export default UserProfile;
