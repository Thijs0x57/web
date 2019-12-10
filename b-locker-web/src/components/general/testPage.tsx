import React from 'react';
import './testPage.scss'
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TestPage: React.FC = () => {
    const { t, i18n } = useTranslation();

    return (
        <div>
            <ul>
                <li>
                    <NavLink to="/">{t('thispage.label')}</NavLink>
                </li>
                <li>
                    <NavLink to="/login">{t('orgloginpage.label')}</NavLink>
                </li>
                <li>
                    <NavLink to="/unlock">{t('userunlockpage.label')}</NavLink>
                </li>
                <li>
                    <NavLink to="/randompagethatwontwork">404</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default TestPage;