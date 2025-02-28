import ArticleList from '@/views/Article/List/Articles';
import ArticleItem from '@/views/Article/Item/Article';
import { Route, Routes } from 'react-router-dom';

const Article = () => (
    <Routes>
        <Route index element={<ArticleList />} />
        <Route path=':id' element={<ArticleItem />} />
    </Routes>
);

export default Article;