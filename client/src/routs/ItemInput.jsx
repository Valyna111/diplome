import ItemInput from "@/views/ItemInput/ItemInput";
import { Route, Routes } from 'react-router-dom';

const Item = () => (
    <Routes>
        <Route path="/" element={<ItemInput/>} />
    </Routes>
);
export default Item;