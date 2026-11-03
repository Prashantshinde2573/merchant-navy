import React, { useEffect, useRef, useState } from 'react';
import './FeedSortMenu.css';

const OPTIONS = ['Recently posted', 'Expiring first', 'Emergency', 'Saved items'];

export function FeedSortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const trigger = useRef(null);
  const items = useRef([]);
  const close = () => { setOpen(false); trigger.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    items.current[OPTIONS.indexOf(value)]?.focus();
    const outside = event => { if (!wrapper.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  const handleKey = event => {
    const index = items.current.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % OPTIONS.length;
    if (event.key === 'ArrowUp') next = (index + OPTIONS.length - 1) % OPTIONS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = OPTIONS.length - 1;
    if (next !== undefined) { event.preventDefault(); items.current[next]?.focus(); }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    if (event.key === 'Tab') setOpen(false);
  };

  return <div className="feed-sort" ref={wrapper}>
    <button ref={trigger} type="button" className="feed-sort-trigger" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? 'feed-sort-options' : undefined}
      onClick={() => setOpen(previous => !previous)} onKeyDown={event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); setOpen(true); } }}>
      <span>Sort by:</span><strong>{value}</strong><span className="material-symbols-outlined" aria-hidden="true">keyboard_arrow_down</span>
    </button>
    {open && <div id="feed-sort-options" role="menu" aria-label="Sort feed" className="feed-sort-menu" onKeyDown={handleKey}>
      {OPTIONS.map((option, index) => <button key={option} ref={element => { items.current[index] = element; }} type="button" role="menuitemradio" aria-checked={option === value} tabIndex={option === value ? 0 : -1}
        onClick={() => { onChange(option); close(); }}>{option}{option === value && <span className="material-symbols-outlined" aria-hidden="true">check</span>}</button>)}
    </div>}
  </div>;
}
