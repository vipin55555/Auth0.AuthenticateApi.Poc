import { ComponentType } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../providers"

export interface IPrivateRouteProps {
    component: ComponentType;
}

export const PrivateRoute = (props: IPrivateRouteProps) => {
    const { t } = useTranslation();
    const {withAuthenticationRequired} = useAuth();
    const Component = withAuthenticationRequired(props.component)
    return <Component />
}