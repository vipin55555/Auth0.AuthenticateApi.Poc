import { Route, Routes } from "react-router-dom";
import { PrivateTest1,PrivateTest2, PrivateNestedTest1, PrivateNestedTest2 } from "../components";
import { PrivateRoute } from "./PrivateRoute";

export const AppRoute = () => {    
    return (
        <Routes>
            <Route path="/privateTest1" element={<PrivateRoute component={PrivateTest1 }/>}>
                <Route path="nestedTest1" element={<PrivateRoute component={PrivateNestedTest1 }/>}/>
                <Route path="nestedTest2"   element={<PrivateRoute component={PrivateNestedTest2 }/>}/>
            </Route>
            <Route path="/privateTest2" element={<PrivateRoute component={PrivateTest2}/>} >
            </Route>
            <Route path="*"element={<PrivateRoute component={PrivateTest1 }/>} /> 
        </Routes>)
}