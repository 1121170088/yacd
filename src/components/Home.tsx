import React from 'react';
// import Loading from './Loading';
// import TrafficChart from './TrafficChart';
import { useTranslation } from 'react-i18next';

import ContentHeader from './ContentHeader';
import s0 from './Home.module.scss';
import TrafficNow from './TrafficNow';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>

      <div className={s0.topBar}>
        <ContentHeader title={t('Overview')} />
      </div>

      <div className={s0.root}>
        <TrafficNow />
        {/*<div className={s0.chart}>*/}
        {/*    <Suspense fallback={<Loading height="200px" />}>*/}
        {/*        <TrafficChart id="DIRECT"/>*/}
        {/*    </Suspense>*/}
        {/*</div>*/}

      </div>
    </div>
  );
}
