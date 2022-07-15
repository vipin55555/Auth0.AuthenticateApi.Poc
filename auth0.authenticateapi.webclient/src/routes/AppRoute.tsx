import { Route, Routes } from "react-router-dom";
import { PrivateTest1,PrivateTest2, PublicTest, PrivateNestedTest1, PrivateNestedTest2 } from "../components";
import { PrivateRoute } from "./PrivateRoute"
import { PublicRoute } from "./PublicRoute";

export const AppRoute = () => {      
    return (
        <Routes>
            <Route path="/privateTest1" element={<PrivateRoute component={PrivateTest1 }/>}>
                <Route path="nestedTest1" element={<PrivateRoute component={PrivateNestedTest1 }/>}/>
                <Route path="nestedTest2"   element={<PrivateRoute component={PrivateNestedTest2 }/>}/>
            </Route>
            <Route path="/privateTest2" element={<PrivateRoute component={PrivateTest2}/>} >
            </Route>
            <Route path="/publicTest" element={<PublicRoute ><PublicTest /></PublicRoute>}>
            </Route>
            <Route path="*"element={<PublicRoute isAuthorized={isAuthenticated}><PublicTest /></PublicRoute>} /> 
        </Routes>)
}