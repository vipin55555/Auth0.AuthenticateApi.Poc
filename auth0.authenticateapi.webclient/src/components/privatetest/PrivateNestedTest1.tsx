import { useTranslation } from "react-i18next";

const PrivateNestedTest1 = () => {
    const { t } = useTranslation();
    return (<div>
        <h1>{t('label-private-nested-one-component')}</h1>
    </div>)
}

export { PrivateNestedTest1  };