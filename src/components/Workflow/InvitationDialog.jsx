import React, {useRef,useState} from 'react';
import {Bold,Italic,List,ListOrdered,Link as LinkIcon,Upload,X} from 'lucide-react';
import {WorkflowDialog} from './WorkflowDialog';

export function InvitationDialog({names,onClose,onSend}) {
 const editor=useRef(null),upload=useRef(null);
 const [message,setMessage]=useState(''),[file,setFile]=useState(null),[error,setError]=useState(''),[sending,setSending]=useState(false);
 const read=()=>{const text=editor.current?.innerText||'';setMessage(text.replace(/\n$/,''));};
 const format=(command)=>{editor.current?.focus();document.execCommand(command,false);read();};
 const chooseFile=event=>{const next=event.target.files?.[0];event.target.value='';if(!next)return;if(next.size>20*1024*1024||!(next.type==='application/pdf'||next.type.startsWith('image/'))){setError('Choose one PDF or image up to 20 MB.');return;}setFile(next);setError('');};
 const send=async()=>{if(sending)return;if(message.length>1500){setError('Message must be 1,500 characters or fewer.');return;}setSending(true);setError('');try{await onSend(message,{fileName:file?.name||'',fileType:file?.type||'',fileSize:file?.size||0,messageHtml:editor.current?.innerHTML||''});onClose();}catch(e){setError(e.message);setSending(false);}};
 return <WorkflowDialog title={`Invite to Discussion - ${names.join(', ')}`} onClose={()=>{if(!sending)onClose();}}>
  <div className="flex items-center justify-between mb-2 text-sm"><span>Message</span><span className="text-xs text-zinc-500" aria-live="polite">{message.length}/1500</span></div>
  <div className="quill"><div className="ql-toolbar ql-snow" role="toolbar" aria-label="Invitation message formatting">
   {[[Bold,'Bold','bold'],[Italic,'Italic','italic'],[ListOrdered,'Ordered list','insertOrderedList'],[List,'Bullet list','insertUnorderedList']].map(([Icon,label,command])=><button key={command} type="button" aria-label={label} onMouseDown={e=>e.preventDefault()} onClick={()=>format(command)}><Icon size={16}/></button>)}
   <button type="button" aria-label="Insert link" onMouseDown={e=>e.preventDefault()} onClick={()=>{const url=window.prompt('Link URL');if(url&&/^https?:\/\//i.test(url)){editor.current?.focus();document.execCommand('createLink',false,url);read();}}}><LinkIcon size={16}/></button>
  </div><div className="ql-container ql-snow"><div ref={editor} className={`ql-editor${message?'':' ql-blank'}`} contentEditable suppressContentEditableWarning role="textbox" aria-label="Invitation message" aria-multiline="true" data-placeholder="Add a quick message..." style={{minHeight:150}} onInput={read} onPaste={event=>{event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'));read();}} /></div></div>
  <div className="flex items-center justify-between mt-6 mb-2 text-sm"><span>Attachment <span className="text-zinc-500">(optional)</span></span><span className="text-xs text-zinc-500">PDF or image (max 20 MB)</span></div>
  <input ref={upload} type="file" accept="application/pdf,image/*" className="hidden" aria-label="Invitation attachment" onChange={chooseFile}/>
  {!file?<button type="button" className="flex min-h-30 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-white px-4 py-6 text-center" onClick={()=>upload.current?.click()}><Upload size={22}/><span className="text-sm font-semibold">Upload File (0/1)</span><span className="text-xs text-zinc-500">Upto 1 files • 20 MB each</span></button>:<div className="flex items-center justify-between gap-2 text-sm"><span className="min-w-0 break-all">{file.name}</span><button type="button" aria-label="Remove attachment" onClick={()=>setFile(null)}><X size={18}/></button></div>}
  {error&&<p role="alert" className="text-sm text-red-600 mt-2">{error}</p>}
  <footer><button disabled={sending} onClick={onClose}>Cancel</button><button disabled={sending||message.length>1500} className="primary" onClick={send}>{sending?'Sending…':'Send Invite'}</button></footer>
 </WorkflowDialog>;
}
