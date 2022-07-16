
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../providers";

export interface IAppFrameProps {
    children: React.ReactNode;
}
const AppFrame = (props: IAppFrameProps) => {
    const { isAuthenticated, isTokenValidated } = useAuth();

    if (isAuthenticated && isTokenValidated) {
        return (<div>
            <Header />
            <br />
            <Sidebar />
            <br />
            {props.children}
        </div>)
    } else {
        return <div></div>
    }
}

export { AppFrame }