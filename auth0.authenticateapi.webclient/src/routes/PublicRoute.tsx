import { Navigate, RouteProps } from "react-router"

export interface IPublicRouteProps extends RouteProps {
    isAuthorized?: boolean;
}
export const PublicRoute = (props: IPublicRouteProps) => {
    
    return <>{props.isAuthorized ? <Navigate to="/privateTest1" /> : <div>{props.children}</div>}</>;
}