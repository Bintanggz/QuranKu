import { useState, useEffect } from 'react';

export function useRouter() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  function parseHash(hash) {
    const clean = hash.replace(/^#\/?/, '');
    if (!clean) return { path: 'home', params: {} };

    const parts = clean.split('/');
    if (parts[0] === 'surah' && parts[1]) {
      return { path: 'surah', params: { id: Number(parts[1]) } };
    }
    if (parts[0] === 'bookmarks' || parts[0] === 'bookmark') {
      return { path: 'bookmarks', params: {} };
    }
    if (parts[0] === 'audio') {
      return { path: 'audio', params: {} };
    }
    if (parts[0] === 'settings') {
      return { path: 'settings', params: {} };
    }

    return { path: 'home', params: {} };
  }

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path, params = {}) => {
    let hash = '#/';
    if (path === 'surah' && params.id) {
      hash = `#/surah/${params.id}`;
    } else if (path !== 'home') {
      hash = `#/${path}`;
    }
    window.location.hash = hash;
  };

  return { route, navigate };
}

