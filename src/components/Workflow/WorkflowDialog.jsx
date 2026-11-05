import React, {useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {useDialogFocus} from '../../hooks/useDialogFocus';
import '../PostActions/PostActions.css';
export function WorkflowDialog({title,onClose,children,className=''}) {
 const ref=useRef(null);useDialogFocus(true,onClose,ref);
 return createPortal(<div className="post-action-backdrop" onClick={event=>{if(event.target===event.currentTarget)onClose();}}><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`post-action-dialog ${className}`}><header><h2>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></header>{children}</section></div>,document.body);
}
