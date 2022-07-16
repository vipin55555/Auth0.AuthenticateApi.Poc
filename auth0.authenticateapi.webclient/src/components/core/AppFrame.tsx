
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../providers";

export interface IAppFrameProps {
    children: React.ReactNode;
}
const AppFrame = (props: IAppFrameProps) => {
    const { isAuthenticated } = useAuth();

    return (<>{isAuthenticated ?
        <div>
            <Header />
            <br />
            <Sidebar />
            <br />
            {props.children}
        </div> :
        <div>{props.children}</div>
    }</>)
}

export { AppFrame }