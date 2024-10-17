import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { TabsTrigger, TabsList, TabsContent,Tabs } from "@radix-ui/react-tabs";
import CommonForm from "@/components/ui/common-form";
import { singUpFormControls } from "@/config";

function AuthPage(){
    const [activeTab, setActiveTab] =  useState('signIn')

    function handleTabChange(value){
        setActiveTab(value);
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
                <TabsContent value = "signIn">signIn</TabsContent>
                <TabsContent value = "signUp">
                    <CommonForm 
                        formControls={singUpFormControls}/>
                        signUp
                        </TabsContent>
            </Tabs>
        </div>
    </div>
    )
}

export default AuthPage;