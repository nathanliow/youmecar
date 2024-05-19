import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import TestPage from './pages/TestPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import OrgPage from './pages/OrgPage'
import EventPage from './pages/EventPage'
import OrgEditPage from './pages/OrgEditPage'
import EventEditPage from './pages/EventEditPage'

export const Pages = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/test" element={<TestPage/>}/>
                <Route path="/:orgId" element={<OrgPage />} />
                <Route path="/:orgId/:eventId" element={<EventPage />} />
                <Route path="edit/:orgId" element={<OrgEditPage />} />
                {/* <Route path="edit/:orgId/:eventId" element={<EventEditPage />} /> */}
                
                {/* <Route element={<NotFoundPage/>}/> */}
            </Routes>
        </BrowserRouter>
    )
}