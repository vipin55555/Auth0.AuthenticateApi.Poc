import { withAuthenticationRequired } from "@auth0/auth0-react"
import { ComponentType } from "react";
import { useTranslation } from 'react-i18next';

export interface IPrivateRouteProps {
    component: ComponentType;
}

export const PrivateRoute = (props: IPrivateRouteProps) => {
    const { t } = useTranslation();
    const Component = withAuthenticationRequired(props.component, { onRedirecting: () => <div>{t('label-loading')}</div> })
    return <Component />
}