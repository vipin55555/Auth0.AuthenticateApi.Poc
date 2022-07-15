import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const PrivateTest2 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (<div>
        <h1>{t('label-private-two-component')}</h1>
        <button onClick={() => navigate('/privateTest1', {replace:true})}> {t('label-go-to-private-one-component')}</button>
    </div>)
}

export  {PrivateTest2};