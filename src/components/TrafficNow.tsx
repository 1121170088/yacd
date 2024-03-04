import * as React from 'react';
import {Suspense} from "react";
import { useTranslation } from 'react-i18next';

import Loading from "$src/components/Loading";
import TrafficChart from "$src/components/TrafficChart";

import * as connAPI from '../api/connections';
import { fetchData } from '../api/traffic';
import prettyBytes from '../misc/pretty-bytes';
import { getClashAPIConfig } from '../store/app';
import { connect } from './StateProvider';
import s0 from './TrafficNow.module.scss';
import { keys } from 'lodash-es';

const { useState, useEffect, useCallback } = React;

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});
export default connect(mapState)(TrafficNow);

function TrafficNow({ apiConfig }) {
  const { t } = useTranslation();
  const speed = useSpeed(apiConfig);
  const state = useConnection(apiConfig);
  const ifconnNumber = function (state) {
    if (state) {
        return (
            <div className={s0.sec}>
                <div>{t('Active Connections')}</div>
                <div>{state.connNumber}</div>
            </div>
        )
    }
  }
    const ifupTotal = function (state) {
        if (state) {
            return (
                <div className={s0.sec}>
                    <div>{t('Upload Total')}</div>
                    <div>{state.upTotal}</div>
                </div>
            )
        }
    }
    const ifdlTotal = function (state) {
        if (state) {
            return (
                <div className={s0.sec}>
                    <div>{t('Download Total')}</div>
                    <div>{state.dlTotal}</div>
                </div>
            )
        }
    }
  return (
    // <div className={s0.TrafficNow}>
    //   <div className={s0.sec}>
    //     <div>{t('Upload')}</div>
    //     <div>{upStr}</div>
    //   </div>
    //   <div className={s0.sec}>
    //     <div>{t('Download')}</div>
    //     <div>{downStr}</div>
    //   </div>
    //   <div className={s0.sec}>
    //     <div>{t('Upload Total')}</div>
    //     <div>{upTotal}</div>
    //   </div>
    //   <div className={s0.sec}>
    //     <div>{t('Download Total')}</div>
    //     <div>{dlTotal}</div>
    //   </div>
    //   <div className={s0.sec}>
    //     <div>{t('Active Connections')}</div>
    //     <div>{connNumber}</div>
    //   </div>
    // </div>
      <div className={s0.aOverview}>
          {
              Object.keys(speed).map((k, i) => {
                  return (
                      <div key={i}>
                          <div className={s0.ChannelName}>{k}</div>
                          <div className={s0.TrafficNow} >
                              <div className={s0.sec}>
                                  <div>{t('Upload')}</div>
                                  <div>{speed[k].upStr}</div>
                              </div>
                              <div className={s0.sec}>
                                  <div>{t('Download')}</div>
                                  <div>{speed[k].downStr}</div>
                              </div>
                              {
                                  ifupTotal(state[k])
                              }
                              {
                                  ifdlTotal(state[k])
                              }
                              {
                                  ifconnNumber(state[k])
                              }


                          </div>

                          <div className={s0.chart}>
                              <Suspense fallback={<Loading height="200px" />}>
                                  <TrafficChart id={k}/>
                              </Suspense>
                          </div>
                      </div>


                  )
              })
          }
      </div>
  );
}

function useSpeed(apiConfig) {
  // const [speed, setSpeed] = useState({ upStr: '0 B/s', downStr: '0 B/s' });
  // useEffect(() => {
  //   return fetchData(apiConfig).subscribe((o) => {
  //           console.log(o)
  //           setSpeed({
  //               upStr: prettyBytes(o.up) + '/s',
  //               downStr: prettyBytes(o.down) + '/s',
  //           })
  //       }
  //
  //   );
  // }, [apiConfig]);
    const [speed, setSpeed] = useState({ });
    useEffect(() => {
        return fetchData(apiConfig, undefined).subscribe((o) => {

            Object.keys(o).map((k) => {
                const item = o[k];
              item.upStr=prettyBytes(item.up) + '/s';
                item.downStr= prettyBytes(item.down) + '/s';
                return true
            });

                setSpeed(o);
            }

        );
    }, [apiConfig]);
  return speed;
}

function useConnection(apiConfig) {
  // const [state, setState] = useState({
  //   upTotal: '0 B',
  //   dlTotal: '0 B',
  //   connNumber: 0,
  // });
  // const read = useCallback(
  //   ({ downloadTotal, uploadTotal, connections }) => {
  //     setState({
  //       upTotal: prettyBytes(uploadTotal),
  //       dlTotal: prettyBytes(downloadTotal),
  //       connNumber: connections.length,
  //     });
  //   },
  //   [setState]
  // );
    const [state, setState] = useState({});
    const read = useCallback(
        (o) => {

            Object.keys(o).map((k) => {
                const item = o[k];
                item.upTotal = prettyBytes(item.uploadTotal);
                item.dlTotal = prettyBytes(item.downloadTotal);
                item.connNumber = item.connections.length;
                return true
            });

            setState(o);
        },
        [setState]
    );
  useEffect(() => {
    return connAPI.fetchData(apiConfig, read);
  }, [apiConfig, read]);
  return state;
}
