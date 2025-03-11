import { Routes, Route } from "react-router-dom";
import UserComments from "@/views/UserComments/UserComments";

const UserBlock= () => (
      <Routes>
        <Route index element={<UserComments />} />
      </Routes>
);
export default UserBlock;
