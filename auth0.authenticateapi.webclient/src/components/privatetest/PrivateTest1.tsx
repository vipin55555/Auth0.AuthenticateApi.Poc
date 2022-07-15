import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, useLocation } from "react-router";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const PrivateTest1 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth0();

    console.log('PrivateTest1 location', JSON.stringify(location.state)); // Some additional passed in state during navigation from prev component

    return (<div>
        <h1>{t('label-private-one-component')}</h1>
        <img src={user?.picture|| ''} alt="User profile pic"/>
        <br />
        <p>{t('label-username')}: {user?.name}</p>
        <p>{t('label-user-email')}: {user?.email}</p>
        <br />
        <div>
            {JSON.stringify(user,null,2)}
        </div>
        <br />
        <div><button onClick={() => navigate('/privateTest2', {replace:true})}> {t('label-go-to-private-two-component')}</button></div>
        <br />
        <button style={{margin:'8px'}} onClick={() => navigate('/privateTest1/nestedTest1')}> {t('label-go-to-private-nested-one-component')}</button>
        <button onClick={() => navigate('/privateTest1/nestedTest2')}> {t('label-go-to-private-nested-two-component')}</button>
        <br />
        <h3>{t('label-nested-routing')}:</h3>
        <Outlet/>
    </div>)
}

export { PrivateTest1 };