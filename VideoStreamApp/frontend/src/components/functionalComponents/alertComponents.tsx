import Alert from "@mui/material/Alert";

export type AlertCardProps = {
  close: any;
}

export type ErrorCardProps = AlertCardProps & {msg? : string};

export const SuccessCard:React.FC<AlertCardProps> = (props: { close: any}) => {
    return(
        <>
         <Alert color='success' severity='success' onClose={props.close}> 
           Upload Successful
         </Alert>     
       </>
     )
    }

export const MissingInfoCard:React.FC<AlertCardProps> = (props: { close: any}) => {
    return(
         <Alert color='error' severity='error' onClose={props.close}> 
           Missing upload information. Try again.
         </Alert>     
     )
    }

export const ErrorCard:React.FC<ErrorCardProps> = (props: ErrorCardProps) => {
    const displayMessage = props.msg ? props.msg : 'Something went wrong! Please try later'
    return(
         <Alert color='error' severity='error' onClose={props.close}>
            {displayMessage}
         </Alert>     
    )
}