import { Route, Routes } from "react-router-dom";
import { PrivateTest1, PrivateTest2, PrivateNestedTest1, PrivateNestedTest2 } from "../components";

export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/privateTest1" element={<PrivateTest1 />}>
                <Route path="nestedTest1" element={<PrivateNestedTest1 />} />
                <Route path="nestedTest2" element={<PrivateNestedTest2 />} />
            </Route>
            <Route path="/privateTest2" element={<PrivateTest2 />} >
            </Route>
            <Route path="*" element={<PrivateTest1 />} />
        </Routes>)
}