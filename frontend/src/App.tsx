import { useState, createContext, Dispatch } from "react";
import Index from "./components";

export type LoginStatus = {
  login: boolean;
  user: string;
  setLogin: Dispatch<boolean>;
  setUser: Dispatch<string>;
};

export const LoginStatusContext = createContext<LoginStatus|undefined>(undefined);

function App() {
  const tokenExist = () => {
    const token = localStorage.getItem('token') || undefined;
    if(!token) return false;
    return true;
} 

const [login, setLogin] = useState(tokenExist);
const [user, setUser] = useState('');
const value = {login, user, setLogin, setUser}
  return (
    <>
      <LoginStatusContext.Provider value={value}>
      <Index/>
      </LoginStatusContext.Provider>
    </>
  );
}

export default App;