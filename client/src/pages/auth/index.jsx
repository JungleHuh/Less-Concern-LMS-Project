import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { TabsTrigger, TabsList, TabsContent,Tabs } from "@radix-ui/react-tabs";
import CommonForm from "@/components/common-form";
import { singInFormControls, singUpFormControls } from "../../config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { AuthContext } from "../../context/auth-context";


function AuthPage(){
    const [activeTab, setActiveTab] =  useState('signIn');
    const {
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        } = useContext(AuthContext);

    function handleTabChange(value){
        setActiveTab(value);
    }
    // 이메일, 패스워드 형식에 알맞은 것만 통과
    function checkIfSignInFormIsValid(){
        return(
            signInFormData &&
            signInFormData.userEmail !== "" &&
            signInFormData.password !== ""
        )
    }

    function checkIfSignUpFormIsValid(){
        return(
            signUpFormData &&
            signUpFormData.userName !== "" &&
            signUpFormData.userEmail !== "" &&
            signUpFormData.password !== ""
        )
    }

    return (
    <div className="flex flex-col min-h-screen">
        <header className=" px-4 lg:px-6 h-14 flex items-center border-b">
            <Link to = {"./"} className = "flex items-center justify-center">
            <GraduationCap className = "h-8 w-8 mr-4"/>
            <span className="font-extrabold text-xl"> LMS Learn</span>
            </Link>
        </header>
        <div className = "flex items-center justify-center min-h-screen bg-background">
            <Tabs
            value = {activeTab}
            defaultValue = "signIn"
            onValueChange = {handleTabChange}
            className="w-full max-w-md"
            >
                <TabsList className = "grid w-full grid-cols-2">
                    <TabsTrigger value = 'signIn'>Sign In</TabsTrigger>
                    <TabsTrigger value = 'signUp'>Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value = "signIn">
                    <Card className = "p-6 space-y-4">
                        <CardHeader>
                            <CardTitle>Sign In </CardTitle>
                            <CardDescription>Enter your Email and PassWord to Access</CardDescription>
                        </CardHeader>
                        <CardContent className ="space-y-2">
                            <CommonForm
                            formControls = {singInFormControls}
                            buttonText = {'Sign In'}
                            formData = {signInFormData}
                            setFormData = {setSignInFormData}
                            isButtonDisabled = {!checkIfSignInFormIsValid()}
                            handleSubmit = {handleLoginUser}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value = "signUp">
                <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                    <CommonForm 
                    formControls={singUpFormControls}
                    buttonText = {'Sign Up'}
                    formData = {signUpFormData}
                    setFormData = {setSignUpFormData}
                    isButtonDisabled = {!checkIfSignUpFormIsValid()}
                    handleSubmit = {handleRegisterUser}
                    />
                    </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
    )
}

export default AuthPage;