import { PortServiceIcon } from '../PortServiceIcon/PortServiceIcon';
import React, { useState } from 'react';
import { Paperclip, Star, MessageCircle } from 'lucide-react';
import { MerchantRowActions } from '../MerchantRowActions/MerchantRowActions';
import './AppliedMerchants.css';
import {Link} from 'react-router-dom';
import {InvitationDialog} from '../Workflow/InvitationDialog';

export function AppliedMerchants({ applications, invited, onInvite, discussion = false }) {
  const [inviteIds,setInviteIds]=useState(null);
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState(null);
  const rows = discussion ? applications.filter(row => invited.includes(row.id) || /discussion|invited/i.test(row.status)) : applications;
  const selectedRows = rows.filter(row => selected.includes(row.id));
  const invite = ids => setInviteIds(ids.filter(id=>!invited.includes(id)));
  if (!rows.length) return <div className="application-list-empty"><MessageCircle size={48} strokeWidth={1.5} aria-hidden="true"/><p>No applications yet</p><p>Applications will appear here when vendors respond to your request</p></div>;
  return <section className="applied-merchants" aria-label={discussion ? 'Merchants in discussion' : 'Merchant applications'}>
    {inviteIds?.length>0 && <InvitationDialog names={rows.filter(row=>inviteIds.includes(row.id)).map(row=>row.merchantName)} onClose={()=>setInviteIds(null)} onSend={async(message,attachment)=>{await onInvite(inviteIds,message,attachment);setSelected([]);}} />}
    <div className="applied-selection"><span>{selectedRows.length} Selected</span><button disabled={!selectedRows.some(row => !invited.includes(row.id))} onClick={() => invite(selectedRows.map(row => row.id))}>Invite All</button></div>
    <div className="applied-table-wrap"><table aria-label="Merchant applications"><thead><tr><th className="applied-checkbox"><input type="checkbox" aria-label="Select all rows" checked={rows.length > 0 && selectedRows.length === rows.length} disabled={!rows.length} onChange={event => setSelected(event.target.checked ? rows.map(row => row.id) : [])} /></th><th>Merchant Name</th><th>Match %</th><th>Applied On</th><th>Actions</th></tr></thead><tbody>
      {rows.map(row => <tr key={row.id}><td className="applied-checkbox"><input type="checkbox" aria-label={`Select ${row.merchantName}`} checked={selected.includes(row.id)} onChange={event => setSelected(previous => event.target.checked ? [...previous, row.id] : previous.filter(id => id !== row.id))} /></td>
        <td className="applied-merchant-cell"><div className="applied-identity"><img src={row.avatar} alt={row.merchantName} /><div><h2>{row.merchantName}</h2><p><Star size={14} fill="currentColor" /><span>{row.rating} <span className="applied-reviews">({row.reviewCount})</span></span></p></div></div></td>
        <td className="applied-match-cell" data-label="Match"><div className="applied-match">{row.matchPercent}%</div><div className="applied-match-detail"><span><PortServiceIcon name="anchor" />{row.portMatch}</span><i /><span><PortServiceIcon name="settings" />{row.serviceMatch}</span></div></td>
        <td data-label="Applied on" className="applied-date">{row.appliedDate || 'Just now'}</td>
        <td className="applied-actions-cell"><div className="applied-row-actions"><div className="application-notes-control"><button className="application-notes-button" aria-label={`Application notes for ${row.merchantName}`} aria-expanded={notes === row.id} onClick={() => setNotes(notes === row.id ? null : row.id)}><Paperclip size={18} /></button>{notes === row.id && <div role="region" aria-label="Application notes" className="application-notes-popover"><h3>Notes</h3><p>{row.scopeSummary || 'No notes available.'}</p>{row.fileName && <p>{row.fileName}</p>}</div>}</div><MerchantRowActions companyName={row.merchantName}>{row.threadId ? <Link className="application-invite" to={`/chats/${row.threadId}`}>Open Thread</Link> : <button className="application-invite" disabled={invited.includes(row.id)} onClick={() => invite([row.id])}>{invited.includes(row.id) ? 'Invited' : 'Invite'}</button>}</MerchantRowActions></div></td>
      </tr>)}
    </tbody></table></div>
  </section>;
}
