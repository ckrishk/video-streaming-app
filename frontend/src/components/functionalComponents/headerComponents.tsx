/* eslint-disable react/jsx-no-undef */
import { Typography, Avatar, Button, Box, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledInputBase, style, Search, ButtonStyle } from "../styles/styles";
import React, { useState } from "react";
import { LoginStatusContext, LoginStatus } from "../../App";
import axios, { AxiosError } from "axios";

export const DefaultHeaderComponent:React.FC<{}> = () => {
    return(
        <>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Streaming Platform
        </Typography>
        </>
    )
}

type OpenFunction = () => void;
type HeaderComponentProps = {
  open: OpenFunction;
}

export const LoggedInHeaderComponent:React.FC<HeaderComponentProps> = (props:{open : any}) => {
    return (
       <>
        <Search>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <UserAvatar></UserAvatar>
        <Button variant="contained" onClick={props.open}>Add New</Button>
        <LogoutButton></LogoutButton>
      </>
  )
}

export const UserAvatar = () => {
  const { user } = React.useContext(LoginStatusContext) as LoginStatus;
  const [avatar, setAvatar] = useState<string>('');
    async function getAvatar() {
       if(user){
        try {
          const { data } = await axios.get(`http://localhost:3000/api/v1/user/avatar?email=${user}`);
          setAvatar(data.avatar);
          } catch(e: any) {
            console.error(e);
        }
       }
      } 
    getAvatar();
    return (
      <Avatar sx={{ m:3, bgcolor: 'secondary.main' }}>{avatar.toUpperCase()}</Avatar>
    )
}

export const LogoutButton:React.FC<{}> = () => {
        const  { setLogin }= React.useContext(LoginStatusContext) as LoginStatus;
        const navigate = useNavigate();
        const handleClick = async () => {
            localStorage.removeItem('token');
            await setLogin(false);
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
    return (
        <>
        <ButtonStyle>
          <Button variant="contained" onClick={handleClick}>Logout</Button>
        </ButtonStyle>
        </>
    )
}

export const ModalPopup = (props: { modalShow?: any, handleClose?:any, submitForm?: any, setVideo?: any, setTitle?:any, setCover?:any}) => { 
    return(
      <div>
      <Modal open={props.modalShow} onClose={props.handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <Box component="form" onSubmit={props.submitForm} noValidate sx={{ mt: 1 }}>
                <label>Video Title:</label>
                <TextField margin="dense" required fullWidth id="title" name="title" autoFocus onChange={(e) => props.setTitle(e.target.value)}/>
                <label>Select Video:</label>
                <TextField margin="dense" required fullWidth id="video" name="video" autoFocus type="file" onChange={(e) => props.setVideo((e.target as any).files[0])} />
                <label>Select Cover Image:</label>
                <TextField margin="normal" required fullWidth id="cover" name="cover" autoFocus type="file" onChange={(e) => props.setCover((e.target as any).files[0])} />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Upload
                </Button> <></>
                <Button type="reset" onClick={props.handleClose} variant="contained" sx={{ mt: 3, mb: 2}}>
                    Close
                </Button>
            </Box>
          </Typography>
         </Box>
        </Modal> 
      </div> 
    )  
    }
    