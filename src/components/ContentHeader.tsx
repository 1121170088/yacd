import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {fetchMemory} from '$src/api/memory-usage';
import { connect } from '$src/components/StateProvider';
import { getClashAPIConfig } from '$src/store/app';

import s0 from './ContentHeader.module.scss';

const { useState, useEffect } = React;
const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

export default connect(mapState)(ContentHeader);
function ContentHeader({apiConfig, title}) {
  const { t } = useTranslation();
  const memory = useMemory(apiConfig);
  return (
    <div className={s0.root}>
      <h1 className={s0.h1}>{title}</h1>
      <div>
        {t('MemoryUsage')}： { (memory.inuse / 1024.0/1024).toFixed(2)} MB
      </div>
    </div>
  );
}

function useMemory(apiConfig) {
  const [memory, setMemory] = useState({
      inuse: 0
  });
  useEffect(() => {
    return fetchMemory(apiConfig, (o) => {
        try {
            const memo = JSON.parse(o);
            setMemory(memo);
        } catch (e) {
            setMemory( {
                inuse: 0
            })
        }
    })
  }, [apiConfig]);
  return memory;
}

