import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Anchor, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { announcements } from '../../data/announcements';
import './Announcements.css';

export function AnnouncementDetail() {
  const { id } = useParams();
  const announcement = announcements.find(item => item.id === id);
  const [shareStatus, setShareStatus] = useState('');

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: announcement.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copied');
      }
    } catch (error) {
      if (error.name !== 'AbortError') setShareStatus('Could not share the announcement');
    }
  };

  return (
    <div className="announcements-page-wrapper bg-blue-25 min-h-[calc(100vh-56px)]">
      <div className="announcement-detail mx-auto w-full max-w-4xl px-6 py-6">
        <nav className="announcement-detail-crumb" aria-label="Breadcrumb">
          <Link to="/announcements"><ArrowLeft size={14} aria-hidden="true" />Back to Announcements</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Announcement Details</span>
        </nav>

        {announcement ? (
          <article className="ui-card announcement-article">
            <header>
              <h1 className="page-title">{announcement.title}</h1>
              <div className="announcement-detail-tags">
                <span>{announcement.category}</span>
                <span><Clock size={12} aria-hidden="true" />{announcement.readingMinutes} min read</span>
              </div>
            </header>
            <div className="announcement-article-body">
              <p>{announcement.content}</p>
              {announcement.image && <img {...announcement.image} />}
            </div>
            <footer>
              <span className="announcement-author-icon"><Anchor size={18} aria-hidden="true" /></span>
              <div className="announcement-author">
                <p>{announcement.author}</p>
                <time dateTime={announcement.publishedOn}>
                  Published {new Date(`${announcement.publishedOn}T00:00:00Z`).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
                  })}
                </time>
              </div>
              <button type="button" onClick={share} aria-label="Share"><Share2 size={18} aria-hidden="true" /></button>
              {shareStatus && <p className="announcement-share-status" role="status">{shareStatus}</p>}
            </footer>
          </article>
        ) : (
          <article className="ui-card announcement-article">
            <header><h1 className="page-title">Announcement not found</h1></header>
          </article>
        )}
      </div>
    </div>
  );
}
