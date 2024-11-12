import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-gaurd/index";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found"
import AddNewCoursePage from "./pages/instructor/add-new-course";
import Community from "./pages/community";
import StudentDashboard from "./pages/student/learning-dashboard";
import ExamBoard from "./components/community/ExamBoard";
import WritePost from "./components/community/board-function/write";
import PostDetail from './pages/community/community-view.jsx'
import MyPage from "./pages/community/community-view.jsx/mypage";
import EditPost from "./components/community/board-function/edit";
import { Toaster } from "@/components/ui/toaster";
import LecturePage from "./pages/lectures";
import MentorRegisterPage from "./pages/mentoring/register";
import MentoringListPage from "./pages/mentoring";
import LectureRegisterPage from "./pages/lectures/register";
import LectureViewPage from "./pages/lectures/view/lecture-view";
import LearningSpacePage from "./pages/lectures/mylecture";
import QuestionForm from "@/pages/questions/index";
import QuestionList from "@/pages/questions/questionList";
import QuestionDetail from "@/pages/questions/questionDetail";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
        <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticate={auth?.authenticate}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticate ={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/add-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticate ={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
        >
    
      <Route
        path = ""
        element={<StudentHomePage/>}    
          />
      <Route 
        path ="home"
        element = {<StudentHomePage/>}
          /> 

        </Route>
      <Route
      path ="*"
      element = {<NotFoundPage/>}
        />
      <Route/>

      <Route 
      path="/community" 
      element= {<RouteGuard
      element = {<Community />}
      authenticate ={auth?.authenticate}
      user={auth?.user}
      />
      }
      />

      <Route path="/community/:examType" element={<ExamBoard />} />
      <Route path="/community/:examType/write" element={<WritePost />} />
      <Route path="/community/:examType/post/:postId" element={<PostDetail />} />

      <Route
  path="/mypage"
  element={
    <RouteGuard
      element={<MyPage />}
      authenticate={auth?.authenticate}
      user={auth?.user}
    />
  }
/>

<Route 
  path="/community/:examType/edit/:postId" 
  element={
    <RouteGuard
      element={<EditPost />}
      authenticate={auth?.authenticate}
      user={auth?.user}
    />
  }
/>

      <Route
        path="/student/learning-dashboard"
        element = {<StudentDashboard/>}
        >

        </Route>

      <Route
      path = "/lectures/:examType"
      element = {<LecturePage />}
      />

      <Route
      path = "/lectures/register"
      element = {<LectureRegisterPage/>}
      />

      <Route
      path = "/mentoring/:examType"
      element = {<MentoringListPage />}
      />  

      <Route
      path = "/mentoring"
      element = {<MentorRegisterPage/>}
      />

      <Route 
      path = "/lecture/view/:lectureId"
      element = {<LectureViewPage />}
      />

      <Route 
      path = "/learning-space"
      element = {<LearningSpacePage />}
      />

      <Route path="/questions" element={<QuestionList />} />
      <Route path="/questions/new" element={<QuestionForm />} />
      <Route path="/questions/:questionId" element={<QuestionDetail />} />

    </Routes>

   

    <Toaster />
    </>

  );
}

export default App;