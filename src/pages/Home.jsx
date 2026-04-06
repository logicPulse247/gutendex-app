import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TbFlask, TbMasksTheater, TbMoodSmile, TbUser, TbYinYang, TbBook, TbCompass, TbArrowRight } from 'react-icons/tb';
import { TEXT } from '../constants/text';
import { CONFIG } from '../constants/config';

const lang = CONFIG.DEFAULT_LANG;

const ICON_PROPS = { size: 20, color: '#5E56E7', strokeWidth: 2 };

const leftCategories = [
  { name: 'Fiction', icon: <TbFlask {...ICON_PROPS} /> },
  { name: 'Drama', icon: <TbMasksTheater {...ICON_PROPS} /> },
  { name: 'Humour', icon: <TbMoodSmile {...ICON_PROPS} /> },
  { name: 'Politics', icon: <TbUser {...ICON_PROPS} /> },
];

const rightCategories = [
  { name: 'Philosophy', icon: <TbYinYang {...ICON_PROPS} /> },
  { name: 'History', icon: <TbBook {...ICON_PROPS} /> },
  { name: 'Adventure', icon: <TbCompass {...ICON_PROPS} /> }
];

export default function Home() {
  const navigate = useNavigate();

  const renderCard = (c) => (
    <button key={c.name} onClick={() => navigate(`/books/${encodeURIComponent(c.name)}`)} className="category-card">
      <div className="card-left">
        <span className="icon">{c.icon}</span>
        <span className="name">{c.name}</span>
      </div>
      <span className="arrow"><TbArrowRight size={20} color="#5E56E7" strokeWidth={2} /></span>
    </button>
  );

  return (
    <>
      <div className="hero">
        <div className="hero-content">

          <h1>{TEXT[lang].title}</h1>
          <p>{TEXT[lang].subtitle}</p>
        </div>
      </div>
      <div className="home">
        <div className="category-layout">
          <div className="category-column">
            {leftCategories.map(renderCard)}
          </div>
          <div className="category-column">
            {rightCategories.map(renderCard)}
          </div>
        </div>
      </div>
    </>
  );
}
