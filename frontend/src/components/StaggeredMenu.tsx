import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap'; 
import './StaggeredMenu.css';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  githubUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  colors?: string[];
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  githubUrl,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#1a1a1a',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  onMenuOpen,
  onMenuClose
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  
  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 초기화: 패널을 오른쪽(100%)으로 보내고 숨김 처리
      if (panelRef.current) {
        gsap.set(panelRef.current, { xPercent: 100, autoAlpha: 1 }); // autoAlpha 1로 설정해두지만 xPercent 때문에 안보임
      }
      if (backdropRef.current) {
        gsap.set(backdropRef.current, { opacity: 0, autoAlpha: 0 });
      }
      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });
    return () => ctx.revert();
  }, [menuButtonColor]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    // 선택자 안전하게 가져오기
    const itemEls = panel ? gsap.utils.toArray<HTMLElement>(panel.querySelectorAll('.sm-panel-item')) : [];
    const socialEls = panel ? gsap.utils.toArray<HTMLElement>(panel.querySelectorAll('.sm-socials-link')) : [];

    const tl = gsap.timeline({
      onComplete: () => { busyRef.current = false; }
    });

    // 1. 배경 페이드 인
    if (backdrop) {
      tl.to(backdrop, { duration: 0.5, autoAlpha: 1, ease: 'power2.out' }, 0);
    }

    // 2. 패널 슬라이드 인 (fromTo로 확실하게 위치 잡기)
    if (panel) {
      tl.fromTo(panel, 
        { xPercent: 100, visibility: 'visible' }, // 시작: 오른쪽 끝
        { xPercent: 0, duration: 0.6, ease: 'power4.out' }, // 끝: 제자리
        0
      );
    }

    // 3. 메뉴 아이템 등장 (아래에서 위로)
    if (itemEls.length > 0) {
      tl.fromTo(itemEls, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        0.2
      );
    }

    // 4. 소셜 아이콘 등장
    if (socialEls.length > 0) {
      tl.fromTo(socialEls,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        0.4
      );
    }
  }, []);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      onComplete: () => { busyRef.current = false; }
    });

    // 패널 슬라이드 아웃
    if (panel) {
      tl.to(panel, { duration: 0.4, xPercent: 100, ease: 'power3.in' }, 0);
    }

    // 배경 페이드 아웃
    if (backdrop) {
      tl.to(backdrop, { duration: 0.4, autoAlpha: 0, ease: 'power2.in' }, 0);
    }
  }, []);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    gsap.to(icon, { 
      rotate: opening ? 225 : 0, 
      duration: 0.5, 
      ease: 'back.out(1.7)' 
    });
  }, []);

  const animateColor = useCallback((opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        gsap.to(btn, { color: targetColor, duration: 0.3 });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    const targetLabel = opening ? 'Close' : 'Menu';
    setTextLines([opening ? 'Menu' : 'Close', targetLabel]);

    gsap.fromTo(inner, 
      { yPercent: 0 },
      { yPercent: -50, duration: 0.4, ease: 'power2.inOut' }
    );
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    if (link.startsWith('#')) {
      const targetId = link.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    toggleMenu();
  };

  const handleBackdropClick = () => {
    if (openRef.current) toggleMenu();
  };

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper'}
      data-open={open}
      data-position={position}
      style={{ '--sm-accent': accentColor } as React.CSSProperties}
    >
      <div ref={backdropRef} className="sm-backdrop" onClick={handleBackdropClick} aria-hidden="true" />

      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div className="sm-logo">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="sm-logo-text">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.418 5.136 20.16 9.25 21.508V18.66C7.545 19.065 6.833 17.81 6.57 17.15C6.38 16.665 5.86 15.69 5.405 15.395C5.04 15.165 4.5 14.65 5.385 14.63C6.275 14.605 6.78 15.42 7.02 15.825C7.99 17.48 9.7 17.02 10.365 16.72C10.455 16.08 10.72 15.615 11.025 15.345C8.82 15.105 6.48 14.24 6.48 10.815C6.48 9.87 6.825 9.09 7.37 8.5C7.28 8.265 6.97 7.32 7.465 6.135C7.465 6.135 8.29 5.88 10.35 7.215C11.14 7.005 11.985 6.9 12.83 6.9C13.675 6.9 14.52 7.005 15.31 7.215C17.37 5.88 18.195 6.135 18.195 6.135C18.69 7.32 18.38 8.265 18.29 8.5C18.835 9.09 19.18 9.87 19.18 10.815C19.18 14.25 16.83 15.105 14.625 15.345C15.015 15.69 15.3 16.32 15.3 17.22V21.508C19.414 20.16 22.55 16.418 22.55 12C22.55 6.477 18.073 2 12.55 2H12Z" />
            </svg>
          </a>
        </div>
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          onClick={toggleMenu}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="sm-toggle-textWrap">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, i) => (
                <span className="sm-toggle-line" key={i}>{l}</span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside ref={panelRef} className="staggered-menu-panel">
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
            {items.map((it, idx) => (
              <li className="sm-panel-itemWrap" key={idx}>
                <a 
                  className="sm-panel-item" 
                  href={it.link} 
                  onClick={(e) => handleLinkClick(e, it.link)}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          {displaySocials && (
            <div className="sm-socials">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list">
                {socialItems.map((s, i) => (
                  <li key={i}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;