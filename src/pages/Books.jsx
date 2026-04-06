import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbArrowLeft, TbSearch } from 'react-icons/tb';
import { TEXT } from '../constants/text';
import { CONFIG } from '../constants/config';

const lang = CONFIG.DEFAULT_LANG;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Books() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [books, setBooks] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchBooks = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const url = new URL(CONFIG.API_BASE_URL);
        url.searchParams.append('topic', topic);
        url.searchParams.append('mime_type', 'image');
        if (CONFIG.DEFAULT_LANG) url.searchParams.append('languages', CONFIG.DEFAULT_LANG);
        if (debouncedSearch) url.searchParams.append('search', debouncedSearch);

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();

        if (!controller.signal.aborted) {
          setBooks(data.results);
          setNextUrl(data.next);
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(TEXT[lang].error);
      } finally {
        if (!controller.signal.aborted) setInitialLoading(false);
      }
    };

    fetchBooks();
    return () => controller.abort();
  }, [topic, debouncedSearch]);

  // Infinite scroll implementation using Intersection Observer
  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      // Trigger new fetch if user is at the bottom and nextUrl is available
      if (entries[0].isIntersecting && nextUrl) {
        setLoading(true);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        fetch(nextUrl, { signal: controller.signal })
          .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then(data => {
            if (!controller.signal.aborted) {
              setBooks(prev => {
                // Safely merge books while avoiding duplicates
                const newIds = new Set(data.results.map(b => b.id));
                const filtered = prev.filter(b => !newIds.has(b.id));
                return [...filtered, ...data.results];
              });
              setNextUrl(data.next);
            }
          })
          .catch(err => {
            if (err.name !== 'AbortError') setError('Failed to load more books');
          })
          .finally(() => {
            if (!controller.signal.aborted) setLoading(false);
          });
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, nextUrl]);

  const openBook = (formats) => {
    const priorityList = ['text/html', 'application/pdf', 'text/plain'];

    const url = priorityList
      .map(type => Object.entries(formats).find(([k, v]) =>
        k.includes(type) && !v.endsWith('.zip')
      )?.[1])
      .find(Boolean);

    if (url) window.open(url, '_blank');
    else alert('No viewable version available');
  };

  return (
    <div className="books-page container">
      <header className="books-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <TbArrowLeft size={24} /> {topic}
        </button>
        <div className="search-wrapper">
          <TbSearch className="search-icon" size={20} />
          <input
            className="search-input"
            placeholder={TEXT[lang].searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {initialLoading && books.length === 0 && (
        <div className="loader-center">
          <div className="spinner"></div>
        </div>
      )}
      <div className="book-grid">
        {books.map((b, index) => {
          const isLast = index === books.length - 1;
          return (
            <div
              key={b.id}
              ref={isLast ? lastBookElementRef : null}
              className="book-card"
              onClick={() => openBook(b.formats)}
            >
              <div className="img-container">
                {b.formats['image/jpeg'] ? (
                  <img src={b.formats['image/jpeg']} alt={b.title} loading="lazy" />
                ) : (
                  <div className="no-img">{TEXT[lang].noCover}</div>
                )}
              </div>
              <div className="info">
                <h3>{b.title}</h3>
                <p>{b.authors?.[0]?.name || 'Unknown'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {loading && books?.length > 0 && (
        <div className="loader-bottom">
          <div className="spinner small"></div>
        </div>
      )}
      {!initialLoading && !loading && !error && books.length === 0 && <div className="loading">{TEXT[lang].noBooks}</div>}
    </div>
  );
}
