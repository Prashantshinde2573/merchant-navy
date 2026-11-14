import React, {useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {useDialogFocus} from '../../hooks/useDialogFocus';
import { MobileSheetHandle } from '../MobileSheet/MobileSheetHandle';
import '../PostActions/PostActions.css';
export function WorkflowDialog({title,onClose,children,className='', mobileSheet=false}) {
 const ref=useRef(null);useDialogFocus(true,onClose,ref);
 return createPortal(<div className={mobileSheet ? "post-action-backdrop mobile-sheet-backdrop" : "post-action-backdrop"} onClick={event=>{if(event.target===event.currentTarget)onClose();}}><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`post-action-dialog ${className}${mobileSheet ? ' mobile-sheet-panel' : ''}`}>
 {mobileSheet && <MobileSheetHandle panelRef={ref} onClose={onClose} />}
 <header><h2>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></header>{children}</section></div>,document.body);
}
