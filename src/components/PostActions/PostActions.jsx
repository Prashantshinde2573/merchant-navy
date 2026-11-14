import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, X } from 'lucide-react';
import { PostModal } from '../PostModal/PostModal';
import { usePosts } from '../../context/PostContext';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import './PostActions.css';

export function PostActions({ post, showClose = false, editOnly = false, onRate }) {
  const navigate = useNavigate();
  const { updatePost } = usePosts();
  const [menu, setMenu] = useState(false);
  const [dialog, setDialog] = useState(null);
  const root = useRef(null), modal = useRef(null);
  useDialogFocus(Boolean(dialog && dialog !== 'edit'), () => setDialog(null), modal);
  useEffect(() => {
    if (!menu) return;
    const close = event => { if (!root.current?.contains(event.target)) setMenu(false); };
    const key = event => { if (event.key === 'Escape') setMenu(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, [menu]);
  const open = value => { setMenu(false); setDialog(value); };
  return <>
    {editOnly ? <button type="button" className="post-edit-button" onClick={() => open('edit')}>Edit Post</button> : <div className="post-actions" ref={root}>
      {onRate && <button type="button" className="post-close-button post-rate-button" onClick={onRate}>Rate Now</button>}
      {showClose && !onRate && !['Closed', 'History'].includes(post.status) && <button type="button" className="post-close-button" onClick={() => open('close')}>Mark Close</button>}
      <button type="button" className="post-overflow-trigger" aria-label="More actions" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><MoreVertical size={20} /></button>
      {menu && <div className="post-overflow-menu" role="menu"><button role="menuitem" autoFocus onClick={() => open('edit')}>Edit Post</button><button role="menuitem" className="danger" onClick={() => open('delete')}>Delete Post</button></div>}
    </div>}
    {dialog === 'edit' && createPortal(<PostModal isOpen post={post} onClose={() => setDialog(null)} />, document.body)}
    {dialog && dialog !== 'edit' && createPortal(<div className="post-action-backdrop" onClick={event => { if (event.target === event.currentTarget) setDialog(null); }}><section ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="post-action-title" className="post-action-dialog">
      <header><h2 id="post-action-title">{dialog === 'close' ? 'Close this post?' : 'Delete this post?'}</h2><button aria-label="Close dialog" onClick={() => setDialog(null)}><X size={20} /></button></header>
      <p>{dialog === 'close' ? 'This post will move to History.' : 'This post will be removed from My Posts.'}</p><footer><button onClick={() => setDialog(null)}>Cancel</button><button className="primary" onClick={() => { updatePost(post.id, dialog === 'close' ? { status: 'Closed' } : { deleted: true }); setDialog(null); if (dialog === 'delete') navigate('/my-posts'); }}>{dialog === 'close' ? 'Mark Close' : 'Delete Post'}</button></footer>
    </section></div>, document.body)}
  </>;
}
