import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link } from 'react-router-dom'


export const VideoCard = (props: {videoId:string, server?:string}) => {
    const base = props.server ? props.server : 'http://127.0.0.1:3000';
    const path = '/api/v1/video';
    const baseUrl = base + path;
      return(
      <Card sx={{ display: 'inline' }}>
      <CardContent sx={{ flex: 1 }}>
          <video autoPlay controls width='1000'>
              <source src={`${baseUrl}/${props.videoId}`} type='video/mp4'/>
          </video>
      </CardContent>
     </Card>
    )
  }

  export const CreatorGrid = (props: {creator: string}) => {
    return(
        <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" color="primary">
            Created by:{props.creator}
        </Typography>
      </Grid>
    )
 }

 export const UploadedInfoGrid = (props: {uploadedDate: string}) => {
  return(
      <>
       <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" color ="primary">  Created by:{props.uploadedDate} </Typography>
      </Grid>
      </>
  )
}

export const TitleGrid = (props: {title?: string}) => {
  return(
      <>
       <Grid item xs={12} md={12}>
        <Typography variant="h5"> {props.title} </Typography>
      </Grid>
      </>
  )
  }

export const MediaCard = (props: {coverImage: any, baseUrl?:string}) => {
  const base = props.baseUrl ? props.baseUrl : 'http://127.0.0.1:3000/';   
  return(
      <>
      <CardMedia
      component="img"
      sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
      image={base + props.coverImage.toString()}
      alt="alt"/>
      </>
      )
  }

export const MediaCardContent = (props: {videoId: string,title: string, uploadDate: string}) => {
    return(
        <>
         <CardContent sx={{ flex: 1 }}>
         <Typography component="h2" variant="h5">
            <Link to={`/video/${props.videoId}`} style={{ textDecoration: "none", color: "black" }}>{props.title}</Link>
          </Typography>
         <Typography variant="subtitle1" color="text.secondary">{props.uploadDate}
         </Typography>
         </CardContent>
        </>
    )
}

export const ErrorGrid = () => {
  return(
      <>
          <Grid>
            <div>
              <h2>
            Upload to get started
              </h2>
            </div>
          </Grid>
          </>
  )
}