/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { Container, Card, CardActionArea, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { MediaCardContent, MediaCard, ErrorGrid } from '../functionalComponents/videoComponents';
import axios from 'axios';
import { LoginStatus, LoginStatusContext } from '../../App';

type VideoObject = {
    _id: string;
    title:string;
    uploadDate:string;
    coverImage:string;
    video:any;
   }

const MediaDisplayGrid = (props: {video: VideoObject}) => {
    const navigate = useNavigate();
        return (
        <>                     
           <Grid item xs={12} md={4} key={props.video._id}>
            <CardActionArea onClick={e => {navigate(`/video/${props.video._id}`)}}>
                <Card sx={{ display: 'flex' }}>
                    <MediaCardContent videoId={props.video.video} title={props.video.title} uploadDate={props.video.uploadDate}/>
                    <MediaCard coverImage={props.video.coverImage}></MediaCard>
                </Card>
            </CardActionArea>
           </Grid>
        </>
    )
}

export default function VideoList() {
    const { login } = React.useContext(LoginStatusContext) as LoginStatus;
    const [videos, setVideos] = React.useState<any>([]);
    const navigate = useNavigate();
   // console.log('login in videoList', login);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const {data} = await axios.get('http://localhost:3000/api/v1/video', {
                    headers: ({
                        Authorization: 'Bearer ' + token
                    })
                });
                if(!data) {
                  return;
                }
                setVideos(data);
                console.log('data=>', data);
            } catch {
         //       setLogin(false); //Fix this
                navigate('/')
            }
        }
        fetchData();
    }, [navigate]);


    const videoList:any[] = videos;

    console.log('login', login);
    if(!login){
        return (
            <></>
        )
    }
    
    return (
        <Container>
            { videoList ? <Grid container spacing={2} marginTop={2}>
            { videoList.map((video:any) => { return <MediaDisplayGrid key={video._id} video={video}/>})}
            </Grid> : <ErrorGrid/> 
            }
        </Container >
    )
}


 
