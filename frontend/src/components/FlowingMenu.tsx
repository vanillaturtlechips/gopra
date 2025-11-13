import './FlowingMenu.css';

interface FlowingMenuProps {
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  images?: Record<string, string>; 
}

export default function FlowingMenu({ items, selectedItem, onSelect, images }: FlowingMenuProps) {
  return (
    <nav className="menu-wrap">
      {items.map((item) => {
        const bgImage = images ? images[item] : undefined;
        const isActive = selectedItem === item;

        return (
          <div 
            key={item} 
            className={`menu__item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => { /* 호버 시 필요한 로직이 있다면 추가 */ }}
            onClick={() => onSelect(item)}
          >
            {/* 1. 평소에 보이는 정적인 텍스트 */}
            <div className="menu__item-link">
              {item}
            </div>
            
            {/* 2. 마우스 올리면 나타나는 배경 + 움직이는 텍스트 */}
            <div 
              className="marquee" 
              style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
            >
              <div className="marquee__inner" aria-hidden="true">
                {/* 끊김 없이 이어지도록 4번 반복 */}
                <span>{item}</span>
                <span>{item}</span>
                <span>{item}</span>
                <span>{item}</span>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}