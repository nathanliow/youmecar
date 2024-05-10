import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';

export const Pages = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/:userId/home">

                </Route>
                {/* <Route element={<NotFoundPage/>}/> */}
            </Routes>
        </BrowserRouter>
    )
}