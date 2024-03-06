import * as React from 'react';

import s0 from './ContentHeader.module.scss';

export default function ContentHeader( {title}) {

  return (
    <div className={s0.root}>
      <h1 className={s0.h1}>{title}</h1>
    </div>
  );
}



