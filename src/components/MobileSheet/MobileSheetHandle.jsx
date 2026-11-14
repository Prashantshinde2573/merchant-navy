import React, { useRef } from 'react';
import './MobileSheet.css';

export function MobileSheetHandle({ panelRef, onClose }) {
  const dragStart = useRef(null);

  const endDrag = event => {
    const start = dragStart.current;
    dragStart.current = null;
    panelRef.current?.style.removeProperty('--mobile-sheet-drag');
    if (start !== null && event.type === 'pointerup' && event.clientY - start > 64) onClose();
  };

  return (
    <div
      className="mobile-sheet-handle"
      aria-hidden="true"
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = event.clientY;
      }}
      onPointerMove={event => {
        if (dragStart.current === null || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const offset = Math.max(0, event.clientY - dragStart.current);
        panelRef.current?.style.setProperty('--mobile-sheet-drag', `${offset}px`);
      }}
      onPointerUp={endDrag}
      onLostPointerCapture={endDrag}
    />
  );
}
