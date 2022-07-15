import { useEffect } from "react"
import i18n from 'i18next'
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";

const Header = (props: any) => {
    const { logout } = useAuth0();
    const { t } = useTranslation();

    useEffect(() => {
    }, [])

    const onLanguageChange = (e: any) => {
        i18n.changeLanguage(e.target.value);
    }

    return (
        <div>
            <h1>{t('label-hello')}</h1>
            <h3>{t('label-change-language')}</h3>
            <select onChange={(e: any) => { onLanguageChange(e) }}>
                <option value="en">English</option>
                <option value="hin">Hindi</option>
            </select>
            <br />
            <h3>Click below to logout</h3>
            <button onClick={() =>logout({returnTo: window.location.origin })}
            >Logout</button>
        </div>
    )
}

export { Header }