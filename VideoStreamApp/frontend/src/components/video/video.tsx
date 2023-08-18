import * as React from 'react';
import { Container, CardActionArea, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoCard, CreatorGrid, UploadedInfoGrid, TitleGrid } from '../functionalComponents/videoComponents';
import axios from 'axios';

export default function Video() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [videoId] = React.useState(id);
    const [videoInfo, setVideoInfo] = React.useState<any>([]);
    const [baseUrl, setBaseUrl] = React.useState<string>('http://127.0.0.1:3000/api/v1/video');

    React.useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const {data} = await axios.get(`${baseUrl}/${videoId}`, {
                    headers: ({
                        Authorization: 'Bearer ' + token
                    })
                });
                console.log(data);
                setVideoInfo(data)
            } catch {
                navigate('/') //TODO: add a error page
            }
        }
        fetchData();
    }, [videoId, baseUrl, navigate]);

    return (
   <Container>
    <Grid item xs={12} md={12} marginTop={10}>
        <CardActionArea>
           {videoId && <VideoCard videoId={videoId}/>}
        </CardActionArea>
    </Grid>
    <Grid container spacing={2} marginTop={2}>
        {videoInfo.createdBy?.fullname && <CreatorGrid creator={videoInfo.createdBy.fullname}/>}
        {videoInfo.uploadedDate && <UploadedInfoGrid uploadedDate={videoInfo.uploadedDate}/>}
        {videoInfo.title && <TitleGrid title={videoInfo.title}/>}
    </Grid>
   </Container>
    );
}







