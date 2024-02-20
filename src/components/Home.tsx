import React from 'react';

import ContentHeader from './ContentHeader';
import s0 from './Home.module.scss';
// import Loading from './Loading';
// import TrafficChart from './TrafficChart';
import TrafficNow from './TrafficNow';

export default function Home() {
  return (
    <div>
      <div>
        <ContentHeader />
      </div>

        <div className={s0.root}>
            <div>
                <TrafficNow />
            </div>
            {/*<div className={s0.chart}>*/}
            {/*    <Suspense fallback={<Loading height="200px" />}>*/}
            {/*        <TrafficChart id="DIRECT"/>*/}
            {/*    </Suspense>*/}
            {/*</div>*/}

        </div>
    </div>
  );
}
