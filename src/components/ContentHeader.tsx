import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {fetchMemory} from '$src/api/memory-usage';
import { connect } from '$src/components/StateProvider';
import { getClashAPIConfig } from '$src/store/app';

import s0 from './ContentHeader.module.scss';

export default function ContentHeader( {title}) {

  return (
    <div className={s0.root}>
      <h1 className={s0.h1}>{title}</h1>
    </div>
  );
}



