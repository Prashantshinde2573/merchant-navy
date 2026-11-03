import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import './TreeSelectionModal.css';

function GroupCheckbox({ label, checked, partial, onChange }) {
  const input = useRef(null);
  useEffect(() => { if (input.current) input.current.indeterminate = partial; }, [partial]);
  return <label><input ref={input} type="checkbox" checked={checked} aria-checked={partial ? 'mixed' : checked} onChange={onChange} /><span>{label}</span></label>;
}

export function TreeSelectionModal({ isOpen, title, subtitle, searchPlaceholder, groups, selected, onApply, onClose }) {
  const [draft, setDraft] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState([]);
  const dialog = useRef(null);
  useDialogFocus(isOpen, onClose, dialog);
  useEffect(() => { if (isOpen) { setDraft([...selected]); setSearch(''); setExpanded([]); } }, [isOpen]);
  if (!isOpen) return null;
  const query = search.trim().toLowerCase();
  const toggleItem = item => setDraft(previous => previous.includes(item) ? previous.filter(value => value !== item) : [...previous, item]);
  const filtered = groups.map(group => ({ ...group, matches: group.name.toLowerCase().includes(query) ? group.children : group.children.filter(item => item.toLowerCase().includes(query)) })).filter(group => !query || group.name.toLowerCase().includes(query) || group.matches.length);
  return <div className="tree-selection-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tree-selection-title" className="tree-selection-dialog">
      <header><div className="tree-selection-title-row"><div><h3 id="tree-selection-title">{title}</h3><p>{subtitle}</p></div><button type="button" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}><X size={18} /></button></div>
        <div className="tree-selection-search"><Search size={18} aria-hidden="true" /><input aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={16} /></button>}</div>
        <div className="tree-selection-tools"><div><button type="button" onClick={() => setExpanded(groups.map(group => group.name))}>Expand All</button><button type="button" onClick={() => setExpanded([])}>Collapse All</button></div>{draft.length > 0 && <button type="button" onClick={() => setDraft([])}>Clear All</button>}</div>
      </header>
      <div className="tree-selection-list">
        {filtered.map(group => {
          const open = Boolean(query) || expanded.includes(group.name);
          const count = group.children.filter(item => draft.includes(item)).length;
          return <div key={group.name} className="tree-selection-group"><div className="tree-selection-row tree-selection-parent">
            <button type="button" aria-label={`${open ? 'Collapse' : 'Expand'} ${group.name}`} aria-expanded={open} onClick={() => setExpanded(previous => previous.includes(group.name) ? previous.filter(name => name !== group.name) : [...previous, group.name])}><ChevronRight size={16} className={open ? 'is-expanded' : ''} /></button>
            <GroupCheckbox label={group.name} checked={group.children.length > 0 && count === group.children.length} partial={count > 0 && count < group.children.length} onChange={() => setDraft(previous => count === group.children.length ? previous.filter(item => !group.children.includes(item)) : [...new Set([...previous, ...group.children])])} />
          </div>{open && group.matches.map(item => <div className="tree-selection-row tree-selection-child" key={item}><label><input type="checkbox" checked={draft.includes(item)} onChange={() => toggleItem(item)} /><span>{item}</span></label></div>)}</div>;
        })}
        {filtered.length === 0 && <p className="tree-selection-empty">No results found</p>}
      </div>
      <footer><button type="button" onClick={onClose}>Cancel</button><button type="button" className="tree-selection-apply" disabled={draft.length === 0} onClick={() => { onApply(draft); onClose(); }}>Apply Selection ({draft.length} selected)</button></footer>
    </section>
  </div>;
}
