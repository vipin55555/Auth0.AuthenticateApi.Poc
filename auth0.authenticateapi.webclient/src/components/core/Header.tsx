import { useEffect } from "react"
import i18n from 'i18next'
import { useTranslation } from "react-i18next";
import { useAuth } from "../../providers";

const Header = (props: any) => {
    const { logout } = useAuth();
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
                <option value="en">{t('label-english')}</option>
                <option value="hin">{t('label-hindi')}</option>
            </select>
            <br />
            <h3>{t('label-click-to-login"')}</h3>
            <button onClick={() =>logout()}
            >{t('label-login')}</button>
        </div>
    )
}

export { Header }