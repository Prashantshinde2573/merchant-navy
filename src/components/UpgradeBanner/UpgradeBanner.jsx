import React from 'react';

export function UpgradeBanner({ className = '', onUpgrade }) {
  return (
    <div className={`border-default-100 shadow-neutral-sm relative flex w-full md:max-w-70.5 gap-3.5 rounded-lg border bg-linear-to-r from-[#1F285D] to-[#2D41B4] p-5 box-border ${className}`}>
      <div className="bg-center-bottom absolute top-0 left-0 h-full w-full bg-[url('/images/upgrade_bg.png')] bg-cover bg-no-repeat opacity-20"></div>
      <span tabIndex="-1" className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny bg-default text-default-foreground rounded-large h-10 w-10 shrink-0">
        <img className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-100" alt="Upgrade Icon" src="/images/upgrade_icon.png" />
      </span>
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <div className="flex flex-col gap-1.5">
          <p className="text-modified-16-semibold font-semibold text-white">Upgrade for More</p>
          <p className="text-modified-13 text-blue-100">Unlock additional visibility and tools designed to help you win consistently.</p>
        </div>
        <div>
          <button type="button" onClick={onUpgrade} tabIndex="0" data-react-aria-pressable="true" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent transform-gpu data-[pressed=true]:scale-[0.97] cursor-pointer outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover bg-danger-500 px-6 py-0 font-semibold text-white">Upgrade Now</button>
        </div>
      </div>
    </div>
  );
}



