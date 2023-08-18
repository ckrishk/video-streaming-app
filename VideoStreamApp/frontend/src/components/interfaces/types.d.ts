export type SetLogin =  {
    setLogIn:(value: boolean) => void;
}

export type SetLoginStatus = {
    isSetLogIn:(value: boolean) => void;
}

export type LoginStatus = {
    isLoggedIn: boolean;
}

export type  SignInProps = {
    isSetLogIn:(value: boolean) => void;
    isLoggedIn:(value: boolean) => boolean;
}