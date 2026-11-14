import { useEffect, useRef, useState } from 'react';
import fallbackWeather from '../data/msl-latest.json';
import {
  fetchLatestSols,
  parseLatestSols,
  type LiveSol,
} from '../game/liveWeather';
import type { Lang } from '../game/types';
import { t } from '../i18n';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'fallback' | 'error';

/**
 * Optional, default-off view of the latest seven sols in NASA's public
 * Curiosity weather feed. It never feeds the mission state. If the browser
 * cannot reach the feed (CORS or an offline venue), it shows the small
 * archived copy clearly labelled as such.
 */
export function LiveWeather({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [sols, setSols] = useState<LiveSol[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function load() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('loading');

    try {
      const latest = await fetchLatestSols(controller.signal);
      if (controller.signal.aborted) return;
      setSols(latest);
      setFetchedAt(`${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`);
      setStatus('ready');
    } catch {
      if (controller.signal.aborted) return;
      try {
        setSols(parseLatestSols(fallbackWeather));
        setFetchedAt(null);
        setStatus('fallback');
      } catch {
        setStatus('error');
      }
    }
  }

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (status === 'idle' || status === 'error') {
      void load();
    }
  }

  return (
    <section
      className="chart-block live-weather"
      aria-labelledby={open ? 'live-weather-title' : undefined}
      aria-label={open ? undefined : t(lang, 'data.liveTitle')}
    >
      <div className="live-weather-head">
        {open && <h3 id="live-weather-title">{t(lang, 'data.liveTitle')}</h3>}
        <button
          type="button"
          className="live-toggle"
          aria-expanded={open}
          aria-controls="live-weather-body"
          data-testid="live-weather-toggle"
          onClick={toggle}
        >
          {open ? t(lang, 'data.liveHide') : t(lang, 'data.liveShow')}
        </button>
      </div>

      {open && (
        <div id="live-weather-body" className="live-weather-body">
          {status === 'loading' && (
            <p className="live-status" role="status">
              {t(lang, 'data.liveLoading')}
            </p>
          )}

          {status === 'error' && (
            <div className="live-status" role="status" data-testid="live-weather-error">
              <p>{t(lang, 'data.liveError')}</p>
              <button
                type="button"
                className="ghost-button"
                data-testid="live-weather-retry"
                onClick={() => void load()}
              >
                {t(lang, 'data.liveRetry')}
              </button>
            </div>
          )}

          {(status === 'ready' || status === 'fallback') && (
            <>
              <p
                className="live-status"
                role="status"
                data-testid={status === 'fallback' ? 'live-weather-fallback' : undefined}
              >
                {status === 'ready'
                  ? t(lang, 'data.liveLoaded', { count: sols.length })
                  : t(lang, 'data.liveFallbackStatus')}
              </p>
              <p className="live-note" data-testid="live-weather-note">
                {status === 'ready'
                  ? t(lang, 'data.liveNote')
                  : t(lang, 'data.liveFallbackNote', {
                      date: fallbackWeather.meta.archivedAt,
                    })}
              </p>
              <div className="live-table-wrap">
                <table className="live-table" data-testid="live-weather-table">
                  <caption>
                    {t(lang, 'data.liveCaption', { count: sols.length })}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">{t(lang, 'data.liveSol')}</th>
                      <th scope="col">{t(lang, 'data.liveDate')}</th>
                      <th scope="col">{t(lang, 'data.liveHigh')}</th>
                      <th scope="col">{t(lang, 'data.liveLow')}</th>
                      <th scope="col">{t(lang, 'data.livePressure')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sols.map((sol) => (
                      <tr key={sol.sol} data-testid="live-weather-row">
                        <th scope="row">{sol.sol}</th>
                        <td>{sol.terrestrialDate}</td>
                        <td>{sol.maxTempC}</td>
                        <td>{sol.minTempC}</td>
                        <td>{sol.pressurePa ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="live-meta">
                {status === 'ready'
                  ? `${t(lang, 'data.liveRetrieved')}: ${fetchedAt}`
                  : `${t(lang, 'data.liveArchived')}: ${fallbackWeather.meta.archivedAt}`}
                {' · '}
                {t(lang, 'data.liveLatest')}: {sols[0]?.terrestrialDate}
              </p>
              {status === 'fallback' && (
                <button
                  type="button"
                  className="ghost-button"
                  data-testid="live-weather-retry"
                  onClick={() => void load()}
                >
                  {t(lang, 'data.liveRetryLive')}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
