import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import { SuccessCard, MissingInfoCard, ErrorCard } from './functionalComponents/alertComponents';
import { DefaultHeaderComponent, LoggedInHeaderComponent, ModalPopup } from './functionalComponents/headerComponents';
import { LoginStatusContext, LoginStatus } from '../App';

export default function StreamingApp() {
    const { login } = React.useContext(LoginStatusContext) as LoginStatus;
    const [modalShow, setModalShow] = React.useState<any>(false);
    const handleModalShow = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    const [success, setSuccess] = React.useState(false);
    const handleSuccessShow = () => setSuccess(true);
    const handleSuccessClose = () => setSuccess(false);

    const [errorState, setErrorState] = React.useState(false);
    const handleErrorClose = () => setErrorState(false);
    const handleErrorShow = () => setErrorState(true);

    const[missingState, setMissingState] = React.useState(false);
    const handleMissingState = () => setMissingState(false);

    const [errorMsg, setErrorMsg] = React.useState('');

    const [video, setVideo] = React.useState<any>('');
    const [cover, setCover] = React.useState<any>('');
    const [title, setTitle] = React.useState<any>('');
    
    //TODO: add to read from config
    const [baseUrl, setBaseUrl] = React.useState<string>('http://localhost:3000/api/v1/video');

    const [post, setPost] = React.useState(null);
    const allowedCoverImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedVideoTypes = ["video/mp4"];

    const submitForm = async (e: any) => {
        e.preventDefault();

        if(!title || !video || !cover){
            setMissingState(true);
            handleModalClose();
            return;
          }
    
        if (!allowedVideoTypes.includes(video.type)) {
            setErrorState(true);
            setErrorMsg("Only MP4 and MOV video formats are allowed. Try again");
            handleModalClose();
            return;
          }
    
        if (!allowedCoverImageTypes.includes(cover.type)) {
            setErrorState(true);
            handleModalClose();
            setErrorMsg("Only JPEG, PNG, and GIF images are allowed. Try again");
            return;
          }
    
        if(title.length < 3){
            setErrorState(true); 
            handleModalClose();
            setErrorMsg("Title should have a min of 3 characters. Try again");
            return;
          }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('video', video);
        formData.append('cover', cover);
        const token = localStorage.getItem('token');
        const header = {
            headers: ({
             Authorization: 'Bearer ' + token
            })
        };
        
        axios
        .post(baseUrl, formData, header)
        .then((response) => {
          setPost(response.data);
          console.log(response.data);
          handleSuccessShow();
          handleModalClose();
        }).catch((e) => {
          handleErrorShow();
          handleModalClose();
        })
    }

    return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DefaultHeaderComponent/>         
          {login ? <>            
            <LoggedInHeaderComponent open={handleModalShow}/>
            <></>
            < ModalPopup 
              modalShow={modalShow} 
              handleClose={handleModalClose} 
              submitForm={submitForm} 
              setVideo={setVideo} 
              setTitle={setTitle} 
              setCover={setCover} 
              />
             </> :
             <></>
            }
        </Toolbar>
            {success && <>
            <SuccessCard close={handleSuccessClose}/>
            </>
            }
            {missingState && <>
            <MissingInfoCard close={handleMissingState}/>
            </>
            }
            {errorState && <>
            <ErrorCard close={handleErrorClose} msg={errorMsg}/>
            </>
            }
      </AppBar>
    </Box>
    );
}

