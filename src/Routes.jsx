import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import TestPage from './pages/TestPage'
import HomePage from './pages/HomePage'
import OrgPage from './pages/OrgPage'
import EventPage from './pages/EventPage'

export const Pages = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/test" element={<TestPage/>}/>
                <Route path="/:orgId" element={<OrgPage />} />
                <Route path="/:orgId/:eventId" element={<EventPage />} />
                {/* <Route element={<NotFoundPage/>}/> */}
            </Routes>
        </BrowserRouter>
    )
}