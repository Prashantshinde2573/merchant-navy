import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './DateRangePicker.css';

export const formatServiceDate = date => `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
const parse = text => { const [day, month, year] = text.split('/').map(Number); return new Date(year, month - 1, day); };
const MONTHS = Array.from({length:12},(_,month)=>new Date(2026,month,1).toLocaleDateString('en-US',{month:'long'}));
export function DateRangePicker({ value, onChange }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(),today.getMonth(),1));
  const [choosingMonth, setChoosingMonth] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const wrapper = useRef(null);
  const trigger = useRef(null);
  const [startText, endText] = value.split(' - ');
  const start = parse(startText), end = parse(endText || startText);
  const close = () => { setOpen(false); setRangeStart(null); setChoosingMonth(false); };
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!wrapper.current?.contains(event.target)) close(); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const toggle = () => {
    if (open) { close(); return; }
    const initial = Number.isNaN(start.getTime()) || start < today ? today : start;
    setMonth(new Date(initial.getFullYear(),initial.getMonth(),1)); setRangeStart(null); setChoosingMonth(false); setOpen(true);
  };
  const chooseDay = date => {
    if (!rangeStart || date < rangeStart) { setRangeStart(date); return; }
    onChange(`${formatServiceDate(rangeStart)} - ${formatServiceDate(date)}`); close(); trigger.current?.focus();
  };
  const first = new Date(month.getFullYear(),month.getMonth(),1);
  const days = Array.from({length:Math.ceil((first.getDay()+new Date(month.getFullYear(),month.getMonth()+1,0).getDate())/7)*7},(_,index)=>new Date(month.getFullYear(),month.getMonth(),1-first.getDay()+index));
  return <div ref={wrapper} className="service-date-picker" onKeyDownCapture={event => { if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close(); trigger.current?.focus(); } }}>
    <div className="service-date-input"><label htmlFor="service-dates-input">Service dates</label><div><input id="service-dates-input" ref={trigger} aria-label="Service dates" aria-expanded={open} aria-controls={open ? 'service-date-calendar' : undefined} readOnly value={value} onClick={toggle} onKeyDown={event=>{ if(['Enter',' ','ArrowDown'].includes(event.key)){event.preventDefault();if(!open)toggle();} }} /><button type="button" aria-label="Calendar Service dates" aria-expanded={open} onClick={toggle}><Calendar size={18} /></button></div></div>
    {open && <div id="service-date-calendar" className="service-date-calendar" role="region" aria-label="Choose service date range">
      <header><button type="button" aria-label="Previous month" disabled={month <= new Date(today.getFullYear(),today.getMonth(),1)} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeft size={16} /></button><button type="button" className="service-date-month" onClick={()=>setChoosingMonth(previous=>!previous)}>{MONTHS[month.getMonth()]} {month.getFullYear()}<ChevronDown size={14} /></button><button type="button" aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRight size={16} /></button></header>
      {choosingMonth ? <div className="service-date-months"><div>{MONTHS.map((label,index)=><button type="button" key={label} aria-pressed={index===month.getMonth()} onClick={()=>{setMonth(new Date(month.getFullYear(),index,1));setChoosingMonth(false);}}>{label}</button>)}</div><div className="service-date-years">{Array.from({length:2100-today.getFullYear()},(_,index)=>today.getFullYear()+index).map(year=><button key={year} type="button" aria-pressed={year===month.getFullYear()} onClick={()=>setMonth(new Date(year,month.getMonth(),1))}>{year}</button>)}</div></div> : <><div className="service-date-weekdays" aria-hidden="true">{['S','M','T','W','T','F','S'].map((day,index)=><span key={index}>{day}</span>)}</div><div className="service-date-days">{days.map(date=>{
        const currentMonth=date.getMonth()===month.getMonth();
        const selected = rangeStart ? date.getTime()===rangeStart.getTime() : date.getTime()===start.getTime()||date.getTime()===end.getTime();
        const inRange=!rangeStart && date > start && date < end;
        return <button type="button" key={date.toISOString()} aria-label={date.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} aria-pressed={selected} disabled={!currentMonth||date<today} data-in-range={inRange} data-today={date.getTime()===today.getTime()} onClick={()=>chooseDay(date)}>{date.getDate()}</button>;
      })}</div></>}
    </div>}
  </div>;
}
