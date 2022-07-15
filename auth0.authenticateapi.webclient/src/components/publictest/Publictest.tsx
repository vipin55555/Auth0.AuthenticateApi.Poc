import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const PublicTest = () => {
    const { loginWithRedirect } = useAuth0();
    const { t } = useTranslation();
    return (<div>
        <h1>{t('label-welcome')}</h1>
        <br />
        <h3>{t('label-click-to-login')}</h3>
        <button onClick={() => loginWithRedirect()}  >
        {t('label-login')}
        </button>
        <h3>{t('label-click-to-signup')}</h3>
        <button onClick={() => loginWithRedirect({ screen_hint: 'signup' })}  >
        {t('label-signup')}
        </button>
    </div>)
}

export { PublicTest };




