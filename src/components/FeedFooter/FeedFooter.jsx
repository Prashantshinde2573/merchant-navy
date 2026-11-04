import React, { useLayoutEffect, useRef, useState } from 'react';

// Stack only when the actual price and action widths cannot share the available row.
export function FeedFooter({ children }) {
  const ref = useRef(null);
  const [stacked, setStacked] = useState(false);
  useLayoutEffect(() => {
    const footer = ref.current;
    const price = footer.querySelector(':scope > p');
    const actions = footer.querySelector(':scope > div');
    if (!price || !actions) return;
    const media = window.matchMedia('(max-width: 1023px)');
    const measure = () => {
      const range = document.createRange();
      range.selectNodeContents(price);
      const priceWidth = range.getBoundingClientRect().width;
      const actionGap = parseFloat(getComputedStyle(actions).columnGap) || 0;
      const items = [...actions.children];
      const actionWidth = items.reduce((width, item) => {
        const style = getComputedStyle(item);
        return width + item.getBoundingClientRect().width + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
      }, 0) + actionGap * Math.max(0, items.length - 1);
      const gap = parseFloat(getComputedStyle(footer).columnGap) || 0;
      setStacked(media.matches && priceWidth + actionWidth + gap > footer.clientWidth);
    };
    const observer = new ResizeObserver(measure);
    [footer, price, ...actions.children].forEach(element => observer.observe(element));
    media.addEventListener('change', measure);
    measure();
    return () => { observer.disconnect(); media.removeEventListener('change', measure); };
  }, [children]);
  return <div ref={ref} data-stacked={stacked} className="home-feed-footer flex w-full flex-row-reverse items-center justify-between">{children}</div>;
}
