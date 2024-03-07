import Tooltip from '@reach/tooltip';
import cx from 'clsx';
import * as React from 'react';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';
// import { FcAreaChart, FcDocument, FcGlobe, FcLink, FcRuler, FcSettings } from 'react-icons/fc';
import { CiDesktop,CiFileOn,CiGlobe ,CiLink, CiRuler, CiSettings} from 'react-icons/ci';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSwitcher } from 'src/components/shared/ThemeSwitcher';

import {connect} from "$src/components/StateProvider";
import {getClashAPIConfig} from "$src/store/app";
import Reboot from "$src/components/Reboot"
import Memory from '$src/components/Memory';

import s from './SideBar.module.scss';
const icons = {
  activity: CiDesktop,
  globe: CiGlobe,
  command: CiRuler,
  file: CiFileOn,
  settings: CiSettings,
  link: CiLink,
};

const SideBarRow = React.memo(function SideBarRow({
  isActive,
  to,
  iconId,
  labelText,
}: SideBarRowProps) {
  const Comp = icons[iconId];
  const className = cx(s.row, isActive ? s.rowActive : null);
  return (
    <Link to={to} className={className} reloadDocument={false}>
      <Comp />
      <div className={s.label}>{labelText}</div>
    </Link>
  );
});

interface SideBarRowProps {
  isActive: boolean;
  to: string;
  iconId?: string;
  labelText?: string;
}

const pages = [
  {
    to: '/',
    iconId: 'activity',
    labelText: 'Overview',
  },
  {
    to: '/proxies',
    iconId: 'globe',
    labelText: 'Proxies',
  },
  {
    to: '/rules',
    iconId: 'command',
    labelText: 'Rules',
  },
  {
    to: '/connections',
    iconId: 'link',
    labelText: 'Conns',
  },
  {
    to: '/configs',
    iconId: 'settings',
    labelText: 'Config',
  },
  {
    to: '/logs',
    iconId: 'file',
    labelText: 'Logs',
  },
];

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});
export default connect(mapState)(SideBar);
function SideBar({apiConfig}) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className={s.root}>
      <div className={s.logoPlaceholder} />

      <Memory />
      <div className={s.rows}>
        {pages.map(({ to, iconId, labelText }) => (
          <SideBarRow
            key={to}
            to={to}
            isActive={location.pathname === to}
            iconId={iconId}
            labelText={t(labelText)}
          />
        ))}
      </div>

      <Reboot/>
      <div className={s.footer}>

        <ThemeSwitcher />
        <Tooltip label={t('about')}>
          <Link to="/about" className={s.iconWrapper}>
            <Info size={20} />
          </Link>
        </Tooltip>
      </div>

    </div>
  );
}



