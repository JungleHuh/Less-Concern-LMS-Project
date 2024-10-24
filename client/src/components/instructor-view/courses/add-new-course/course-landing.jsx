import FormControls from "@/components/common-form/form-controls";
import { courseLandingPageFormControls } from "@/config";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { InstructorContext } from "@/context/instructor-context";
import { useState } from "react";
//이거 3개를 하나로 줄이기 (불가능 or 가능?)
function CourseLanding() {
    const [courseLandingFormData, setCourseLandingFormData] = useState(InstructorContext);

    return ( 
        <Card>
            <CardHeader>
            <CardTitle>Course Landing Page</CardTitle>
            </CardHeader>
            <CardContent>
                <FormControls
                formControls={courseLandingPageFormControls}
                formData = {courseLandingFormData}
                setCourseLandingFormData = {setCourseLandingFormData}
                />
            </CardContent>
            </Card>
     );
}

export default CourseLanding;