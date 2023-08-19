
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import Header from "./StreamingApp";
import VideoList from "./video/videoList";
import Video from "./video/video";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";

export default function Index() {
    return (
        <div>
            <BrowserRouter>
                    <Header/>
                    <Routes>
                        <Route path="/videos" element={<VideoList></VideoList>}> </Route>
                        <Route path="/video/:id" element={<Video/>}></Route>
                        <Route path="/" element={<SignIn/>}></Route>
                        <Route path="/signup" element={<SignUp/>}></Route>
                    </Routes>
            </BrowserRouter>
        </div>
    )
}