import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstructorContext } from "@/context/instructor-context";
import { createContext, useState, useContext } from "react";
import { courseCurriculumInitialFormData} from "@/config"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function CourseCurriculum() {
    const {courseCurriculumFormData, setCourseCurriculumFormData} = 
    useContext(InstructorContext);

    function handleNewLecture(){
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0],
            }
        ])
    }

    function handleCourseTitleChange(event, currentIndex){
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
            
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            title: event.target.value
        }
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleFreePreviewChange(currentValue, currentIndex){
        console.log(currentValue, currentIndex);

    }
   return (
    <Card>
        <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
            <Button onClick = {handleNewLecture}>Add lecture</Button>
            <div className=" mt-4 space-y-4">
                {
                    courseCurriculumFormData.map((curriculumItem, index) =>
                        <div className = "border p-5 rounded-md">
                            <div className="flex gap-5">
                                <h3 className="font-semibold">Lecture {index + 1} </h3>
                                <Input
                                name = {`title: ${index+1}`}
                                placeholder = "Enter Lecture Name"
                                className = "max-w-96"
                                onChange= { (event) => handleCourseTitleChange(event, index)}
                                value = {courseCurriculumFormData[index]?.title}
                                />
                                <div className=" flex items-center space-x-2">
                                    <Switch
                                    onCheckedChange = {(value) => handleFreePreviewChange(value, index)}
                                    checked = {true}
                                    id = {`freePreview-${index+1}`}
                                    />
                                    <Label htmlFor ={`freePreview-${index+1}`} >Free Preview</Label>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Input
                                    type = "file"
                                    accept = "video/*"
                                    className = "mb-4"
                                    />
                                </div>
                            </div>
                )
                }
            </div>
        </CardContent>
    </Card>
   );
}

export default CourseCurriculum;