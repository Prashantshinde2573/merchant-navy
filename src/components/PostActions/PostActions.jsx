import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, X } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import './PostActions.css';

export function PostActions({ post, showClose = false, editOnly = false }) {
  const navigate = useNavigate();
  const { updatePost } = usePosts();
  const [menu, setMenu] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [title, setTitle] = useState(post.title || '');
  const [scope, setScope] = useState(post.scopeOfWork || post.description || '');
  const root = useRef(null), modal = useRef(null);
  useDialogFocus(Boolean(dialog), () => setDialog(null), modal);
  useEffect(() => {
    if (!menu) return;
    const close = event => { if (!root.current?.contains(event.target)) setMenu(false); };
    const key = event => { if (event.key === 'Escape') setMenu(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, [menu]);
  const open = value => { setMenu(false); setTitle(post.title || ''); setScope(post.scopeOfWork || post.description || ''); setDialog(value); };
  return <>
    {editOnly ? <button type="button" className="post-edit-button" onClick={() => open('edit')}>Edit Post</button> : <div className="post-actions" ref={root}>
      {showClose && !['Closed', 'History'].includes(post.status) && <button type="button" className="post-close-button" onClick={() => open('close')}>Mark Close</button>}
      <button type="button" className="post-overflow-trigger" aria-label="More actions" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><MoreVertical size={20} /></button>
      {menu && <div className="post-overflow-menu" role="menu"><button role="menuitem" autoFocus onClick={() => open('edit')}>Edit Post</button><button role="menuitem" className="danger" onClick={() => open('delete')}>Delete Post</button></div>}
    </div>}
    {dialog && createPortal(<div className="post-action-backdrop" onClick={event => { if (event.target === event.currentTarget) setDialog(null); }}><section ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="post-action-title" className="post-action-dialog">
      <header><h2 id="post-action-title">{dialog === 'edit' ? 'Edit Post' : dialog === 'close' ? 'Close this post?' : 'Delete this post?'}</h2><button aria-label="Close dialog" onClick={() => setDialog(null)}><X size={20} /></button></header>
      {dialog === 'edit' ? <form onSubmit={event => { event.preventDefault(); updatePost(post.id, { title, scopeOfWork: scope, description: scope }); setDialog(null); }}><label>Title<input required value={title} onChange={event => setTitle(event.target.value)} /></label><label>Scope of work<textarea required rows={6} value={scope} onChange={event => setScope(event.target.value)} /></label><footer><button type="button" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="primary">Save changes</button></footer></form> : <><p>{dialog === 'close' ? 'This post will move to History.' : 'This post will be removed from My Posts.'}</p><footer><button onClick={() => setDialog(null)}>Cancel</button><button className="primary" onClick={() => { updatePost(post.id, dialog === 'close' ? { status: 'Closed' } : { deleted: true }); setDialog(null); if (dialog === 'delete') navigate('/my-posts'); }}>{dialog === 'close' ? 'Mark Close' : 'Delete Post'}</button></footer></>}
    </section></div>, document.body)}
  </>;
}
