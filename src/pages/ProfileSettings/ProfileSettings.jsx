import React, { useState } from 'react';
import './ProfileSettings.css';

export function ProfileSettings() {
  const [settings, setSettings] = useState({
    invitesShortlist: true,
    messages: true,
    quoteRequests: true,
    awards: true,
    deadlines: true,
    ratings: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItems = [
    {
      key: 'invitesShortlist',
      title: 'Invites / Shortlist',
      desc: "When you're shortlisted or invited to an RFQ",
    },
    {
      key: 'messages',
      title: 'Messages',
      desc: 'New messages in threads',
    },
    {
      key: 'quoteRequests',
      title: 'Quote Requests',
      desc: 'When a buyer requests a quote from you',
    },
    {
      key: 'awards',
      title: 'Awards',
      desc: "When you're awarded an RFQ",
    },
    {
      key: 'deadlines',
      title: 'Deadlines',
      desc: 'RFQ closing deadlines and important dates',
    },
    {
      key: 'ratings',
      title: 'Ratings',
      desc: 'When you receive ratings or rating requests',
    },
  ];

  return (
    <div className="profile-settings-page-wrapper bg-blue-25 min-h-[calc(100vh-56px)] px-6 py-6">
      <div className="settings-content-container">
        <div className="mb-6 flex flex-col gap-1.5">
          <h1 className="text-content1-foreground text-2xl leading-8 font-semibold text-[#18181b]">Settings</h1>
          <p className="text-base leading-6 font-normal text-zinc-500">Manage your account preferences</p>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div className="settings-card bg-content1 shadow-medium rounded-large transition-transform-background shadow-neutral-sm border border-blue-50" tabIndex="-1">
            <div className="settings-card-inner relative w-full flex-auto flex flex-col md:flex-row gap-6 p-6 sm:p-8">
              <div className="settings-left-col">
                <h3 className="text-content1-foreground text-xl leading-7 font-semibold text-[#18181b]">Notifications</h3>
                <p className="mt-1.5 text-sm leading-5 font-normal text-[#696f93]">Manage your notification preferences</p>
              </div>
              <div className="settings-right-col flex flex-col divide-y divide-gray-100">
                {toggleItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4">
                    <div className="flex flex-col gap-0.5 pr-4 min-w-0 flex-1">
                      <p className="text-[15px] text-content2-foreground font-semibold tracking-[-0.1px] text-[#27272a]">{item.title}</p>
                      <p className="text-sm leading-5 font-normal text-zinc-500">{item.desc}</p>
                    </div>
                    <label
                      className="settings-toggle-label group relative max-w-fit inline-flex items-center justify-start cursor-pointer touch-none select-none"
                      data-selected={settings[item.key] ? 'true' : 'false'}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSetting(item.key);
                      }}
                    >
                      <input
                        type="checkbox"
                        role="switch"
                        aria-checked={settings[item.key]}
                        checked={settings[item.key]}
                        onChange={() => toggleSetting(item.key)}
                        style={{
                          opacity: 0.0001,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer',
                          zIndex: 1,
                          margin: 0,
                          padding: 0,
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className={`settings-toggle-track px-1 relative inline-flex items-center justify-start shrink-0 overflow-hidden rounded-full w-12 h-7 transition-colors ${
                          settings[item.key] ? 'is-checked bg-[#1f285d]' : 'is-unchecked bg-[#e4e4e7]'
                        }`}
                        style={{
                          width: '48px',
                          height: '28px',
                          padding: '0 4px',
                          borderRadius: '9999px',
                          backgroundColor: settings[item.key] ? '#1f285d' : '#e4e4e7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          boxSizing: 'border-box',
                          flexShrink: 0,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <span
                          className={`settings-toggle-thumb z-10 flex items-center justify-center bg-white rounded-full w-5 h-5 shadow-sm pointer-events-none ${
                            settings[item.key] ? 'is-checked translate-x-5' : 'is-unchecked translate-x-0'
                          }`}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '9999px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 1px 0 rgba(0, 0, 0, 0.3)',
                            transform: settings[item.key] ? 'translateX(20px)' : 'translateX(0px)',
                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            flexShrink: 0,
                          }}
                        />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
