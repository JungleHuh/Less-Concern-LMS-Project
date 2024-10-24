import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

function CourseSetting() {
    return ( 
        <Card>
            <CardHeader>
                <CardTitle>Course Setting</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <Label>Uploade Image</Label>
                    <Input
                    type = "file"
                    accept = "image/*"
                    className = "mb-4"
                    />

                </div>
            </CardContent>
            </Card>
     );
}

export default CourseSetting;