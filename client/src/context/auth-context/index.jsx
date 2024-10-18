/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { initializeSignInFormData, initializeSignUpFormData} from '../../config';
import { registerService } from "../../services";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [signInFormData, setSignInFormData] = useState(initializeSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initializeSignUpFormData);

    async function handleRegisterUser(event){
      event.preventDefault();
      const data = await registerService(signUpFormData);

      console.log(data)
      }
    

    return (
        <AuthContext.Provider value={{
            signInFormData,
            setSignInFormData,
            signUpFormData,
            setSignUpFormData,
            handleRegisterUser,
        }}
        >
          {children}
        </AuthContext.Provider>
      );
}