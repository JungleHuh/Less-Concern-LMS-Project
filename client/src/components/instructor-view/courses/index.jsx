import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";



function InstructorCourses() {
  
  const usenavigate = useNavigate();
    return (
        <Card>
            <CardHeader className = "flex justify-between flex-row items-center">
                <CardTitle className = "text-3xl font-extrabold">
                    All Courses
                </CardTitle>
                <Button onClick = {()=> usenavigate('/instructor/add-new-course')} 
                        className = "p-6">
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">강의 목록</TableHead>
      <TableHead>수강생 수</TableHead>
      <TableHead>매출</TableHead>
      <TableHead className="text-right">액션</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">리액트 강의</TableCell>
      <TableCell>100명 수강</TableCell>
      <TableCell>5000 </TableCell>
      <TableCell className="text-right">
            <Button variant = "ghost" size = "sm" className = "mr-2">
        <Edit className=" h-6 w-6"/>
            </Button >
            <Button variant = "ghost" size = "sm" className = "mr-2">
            <Delete className = "h-6 w-6"/>
            </Button>
            </TableCell>
    </TableRow>
  </TableBody>
</Table></div>
            </CardContent>
            
    </Card>
      );
}

export default InstructorCourses;