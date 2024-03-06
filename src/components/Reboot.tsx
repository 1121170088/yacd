import Tooltip from '@reach/tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { rebootF } from 'src/api/reboot';

import s from './Reboot.module.scss';
import { getClashAPIConfig } from '$src/store/app';
import { connect } from '$src/components/StateProvider';


const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(Reboot);
function Reboot({apiConfig}) {
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();
    rebootF(apiConfig, alert);
  }

  console.log(apiConfig)

  return (
    <Tooltip label={t('reboot')} >
      <button className={s.reboot}  onClick={handleSubmit}>
        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="1450" width="20" height="20">
          <path
            d="M505.6 960c-115.2 0-230.4-44.8-313.6-128C12.8 652.8 12.8 371.2 192 192c12.8-12.8 25.6-12.8 38.4-12.8 12.8 0 32 6.4 38.4 19.2 19.2 19.2 19.2 57.6 0 76.8-134.4 134.4-134.4 345.6 0 480 64 64 147.2 102.4 236.8 102.4 89.6 0 172.8-32 236.8-96s102.4-147.2 102.4-236.8c0-89.6-32-172.8-96-236.8-19.2-25.6-19.2-57.6 0-83.2 12.8-12.8 25.6-12.8 38.4-12.8 12.8 0 25.6 6.4 38.4 12.8 83.2 89.6 128 198.4 128 320s-51.2 230.4-140.8 313.6C736 915.2 627.2 960 505.6 960z m12.8-390.4c-32 0-57.6-25.6-57.6-57.6V121.6c0-32 25.6-57.6 57.6-57.6s57.6 25.6 57.6 57.6v396.8c-6.4 25.6-32 51.2-57.6 51.2z"
            fill="#3C4353" p-id="1451"></path>
        </svg>
      </button>
    </Tooltip>
  );
}