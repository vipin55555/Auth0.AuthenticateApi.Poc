import { useTranslation } from "react-i18next";
const PrivateNestedTest2 = () => {
    const { t } = useTranslation();
    return (<div>
        <h1>{t('label-private-nested-two-component')}</h1>
    </div>)
}

export { PrivateNestedTest2 };