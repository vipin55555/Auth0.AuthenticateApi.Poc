import { useAuth0 } from "@auth0/auth0-react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export interface IAppFrameProps {
    children: React.ReactNode;
}
const AppFrame = (props: IAppFrameProps) => {
    const { isAuthenticated } = useAuth0();

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