import React, { useState, createContext, useContext, useEffect } from 'react';

// Hook for responsive design
const useWindowWidth = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 500);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
};

// Generate image filename from brand and flavour
const getImageFilename = (brand, flavour) => {
  const slugify = (str) => str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${slugify(brand)}-${slugify(flavour)}.png`;
};

// Theme Context
const ThemeContext = createContext();

const themes = {
  light: {
    bg: '#F5F3EF',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#EBE8E2',
    text: '#1A1A1A',
    textSecondary: '#6B6560',
    textMuted: '#9A948C',
    accent: '#E86A33',
    accentHover: '#D55A25',
    border: '#DDD9D2',
    cardBg: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.06)',
    success: '#3D8C40',
    rank1: '#E86A33',
    rank2: '#8A8A8A',
    rank3: '#A67C52',
  },
  dark: {
    bg: '#1A1917',
    bgSecondary: '#242320',
    bgTertiary: '#2E2D2A',
    text: '#F5F3EF',
    textSecondary: '#A8A39C',
    textMuted: '#6B6560',
    accent: '#E86A33',
    accentHover: '#F07A43',
    border: '#3A3835',
    cardBg: '#242320',
    shadow: 'rgba(0,0,0,0.3)',
    success: '#5AAD5D',
    rank1: '#E86A33',
    rank2: '#8A8A8A',
    rank3: '#A67C52',
  }
};

// Flavour to colour mapping
const flavourColours = {
  'chocolate': '#5C4033',
  'brownie': '#4A3728',
  'cookie': '#C9A67A',
  'cookies': '#C9A67A',
  'cream': '#F0EDE5',
  'peanut': '#C4A35A',
  'peanut butter': '#B8934A',
  'caramel': '#D4943A',
  'salted caramel': '#C4843A',
  'coconut': '#F5F0E6',
  'churro': '#D2A679',
  'cinnamon': '#B5651D',
  'mint': '#7FBFAB',
  'blueberry': '#5B7BB4',
  'birthday': '#E8A0B4',
  'cake': '#F0C0D0',
  'banana': '#E8D474',
  'white chocolate': '#F5EFE0',
  'vanilla': '#F0E5C8',
  'crisp': '#E8DCC8',
  'cashew': '#D4B896',
  'dough': '#D8C8A8',
  'oreo': '#2D2D2D',
  'sea salt': '#94B8C8',
  'default': '#A8A39C',
};

const getFlavourColour = (flavour) => {
  const lowerFlavour = flavour.toLowerCase();
  for (const [key, colour] of Object.entries(flavourColours)) {
    if (lowerFlavour.includes(key)) {
      return colour;
    }
  }
  return flavourColours.default;
};

// Real protein bar data
const initialSnacks = [
  { id: 1, name: 'Built Puff', brand: 'Built', flavour: 'Brownie Batter', protein: 17, calories: 130, sugar: 4, fiber: 4, price: 4.99, description: 'Marshmallow-style protein bar, chocolate coated', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 2, name: 'Built Puff', brand: 'Built', flavour: 'Coconut', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Coconut-flavoured puff protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 3, name: 'Built Puff', brand: 'Built', flavour: 'Churro', protein: 17, calories: 140, sugar: 4, fiber: 4, price: 4.99, description: 'Cinnamon churro-inspired puff bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 4, name: 'Built Puff', brand: 'Built', flavour: 'Salted Caramel', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Sweet caramel with salt, marshmallow texture', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 5, name: 'Built Puff', brand: 'Built', flavour: 'Mint Chocolate Chip', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Mint chocolate puff protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 6, name: 'Built Puff', brand: 'Built', flavour: 'Cookies & Cream', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Cookies & cream marshmallow protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 7, name: 'RXBAR', brand: 'RXBAR', flavour: 'Peanut Butter Chocolate', protein: 12, calories: 210, sugar: 15, fiber: 5, price: 3.49, description: 'Minimal-ingredient bar with dates & egg whites', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 8, name: 'RXBAR', brand: 'RXBAR', flavour: 'Chocolate Sea Salt', protein: 12, calories: 210, sugar: 14, fiber: 5, price: 3.49, description: 'Cocoa-based bar with sea salt', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 9, name: 'RXBAR', brand: 'RXBAR', flavour: 'Blueberry', protein: 12, calories: 210, sugar: 15, fiber: 5, price: 3.49, description: 'Fruit-forward protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 10, name: 'Diesel Protein Bar', brand: 'Perfect Sports', flavour: 'Cookies & Cream', protein: 18, calories: 190, sugar: 2, fiber: 9, price: 3.99, description: 'Whey-based high-protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 11, name: 'Diesel Protein Bar', brand: 'Perfect Sports', flavour: 'Chocolate Peanut Butter', protein: 18, calories: 190, sugar: 2, fiber: 9, price: 3.99, description: 'Chocolate PB whey protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 12, name: 'Diesel Protein Bar', brand: 'Perfect Sports', flavour: 'Cookie Dough', protein: 18, calories: 190, sugar: 2, fiber: 9, price: 3.99, description: 'Cookie dough flavoured protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 13, name: 'ONE Bar', brand: 'ONE Brands', flavour: 'Chocolate Chip Cookie Dough', protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: 'High-protein, low sugar bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 14, name: 'ONE Bar', brand: 'ONE Brands', flavour: 'Birthday Cake', protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: 'Birthday cake flavoured protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 15, name: 'ONE Bar', brand: 'ONE Brands', flavour: "Hershey's Cookies & Cream", protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: "Licensed Hershey's flavour", rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 16, name: 'ONE Bar', brand: 'ONE Brands', flavour: "Reese's Peanut Butter", protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: "Reese's PB flavour protein bar", rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 17, name: 'Alani Nu Protein Bar', brand: 'Alani Nu', flavour: 'Chocolate Cake', protein: 15, calories: 170, sugar: 3, fiber: 7, price: 3.99, description: 'Dessert-style protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 18, name: 'Alani Nu Protein Bar', brand: 'Alani Nu', flavour: 'Peanut Butter Chocolate', protein: 15, calories: 170, sugar: 3, fiber: 7, price: 3.99, description: 'Sweet PB chocolate flavour', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 19, name: 'Barebells', brand: 'Barebells', flavour: 'Cookies & Cream', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Soft milk-chocolate coated bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 20, name: 'Barebells', brand: 'Barebells', flavour: 'Creamy Crisp', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Crispy texture with milk chocolate', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 21, name: 'Barebells', brand: 'Barebells', flavour: 'Caramel Cashew', protein: 20, calories: 200, sugar: 2, fiber: 6, price: 4.79, description: 'Caramel and cashew flavour', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 22, name: 'Barebells', brand: 'Barebells', flavour: 'Chocolate Dough', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Cookie-dough inspired bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 23, name: 'Barebells', brand: 'Barebells', flavour: 'Birthday Cake', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Cake-style protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 24, name: 'TRUBAR', brand: 'TRUBAR', flavour: 'Oh Oh Cookie Dough', protein: 12, calories: 230, sugar: 12, fiber: 4, price: 3.49, description: 'Plant-based protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 25, name: 'TRUBAR', brand: 'TRUBAR', flavour: "Don't Go Bananas", protein: 12, calories: 230, sugar: 11, fiber: 4, price: 3.49, description: 'Banana-based vegan protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 26, name: 'TRUBAR', brand: 'TRUBAR', flavour: 'Get In My Belly', protein: 12, calories: 230, sugar: 12, fiber: 4, price: 3.49, description: 'Peanut butter chocolate vegan bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 27, name: 'Grenade Carb Killa', brand: 'Grenade', flavour: 'Oreo', protein: 20, calories: 210, sugar: 1, fiber: 8, price: 4.49, description: 'Low-sugar, layered protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 28, name: 'Grenade Carb Killa', brand: 'Grenade', flavour: 'White Chocolate Salted Peanut', protein: 20, calories: 210, sugar: 1, fiber: 8, price: 4.49, description: 'Sweet-salty high protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 29, name: 'Quest Bar', brand: 'Quest', flavour: 'Chocolate Chip Cookie Dough', protein: 20, calories: 190, sugar: 1, fiber: 14, price: 6.49, description: 'High fibre, low sugar protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 30, name: 'Quest Bar', brand: 'Quest', flavour: 'Cookies & Cream', protein: 20, calories: 190, sugar: 1, fiber: 14, price: 6.49, description: 'Whey + fibre protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 31, name: 'Legendary Protein Pastry', brand: 'Legendary Foods', flavour: 'Cinnamon Roll', protein: 20, calories: 200, sugar: 2, fiber: 7, price: 4.99, description: 'Pop-tart style protein pastry', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 32, name: 'Legendary Protein Pastry', brand: 'Legendary Foods', flavour: 'Chocolate Cake', protein: 20, calories: 200, sugar: 2, fiber: 7, price: 4.99, description: 'Soft-baked protein pastry', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 33, name: 'Warrior Crunch', brand: 'Warrior', flavour: 'Chocolate Chip Cookie Dough', protein: 20, calories: 220, sugar: 2, fiber: 7, price: 4.49, description: 'Crispy layered protein bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 34, name: 'Love Good Fats', brand: 'Love Good Fats', flavour: 'Chocolate Chip Cookie Dough', protein: 10, calories: 220, sugar: 2, fiber: 8, price: 3.99, description: 'Keto-friendly fat-forward bar', rating: 0, yesVotes: 0, totalVotes: 0 },
  { id: 35, name: 'SimplyProtein Crispy', brand: 'SimplyProtein', flavour: 'Peanut Butter Chocolate', protein: 13, calories: 150, sugar: 1, fiber: 5, price: 2.75, description: 'Crispy soy-based protein bars', rating: 0, yesVotes: 0, totalVotes: 0 },
];

// Lightbox Component
const Lightbox = ({ imageUrl, alt, onClose }) => {
  const theme = useContext(ThemeContext);
  
  if (!imageUrl) return null;
  
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 'var(--spacing-lg)',
        cursor: 'zoom-out',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'var(--spacing-md)',
          right: 'var(--spacing-md)',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#fff',
        }}
      >
        ×
      </button>
      <img
        src={imageUrl}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90%',
          maxHeight: '80vh',
          borderRadius: 'var(--radius-lg)',
          objectFit: 'contain',
          cursor: 'default',
        }}
      />
    </div>
  );
};

// Flavour Circle Component (with optional image)
const FlavourCircle = ({ flavour, brand, size = 48, fullWidth = false, onImageClick }) => {
  const [imgError, setImgError] = useState(false);
  const colour = getFlavourColour(flavour);
  const isLight = ['#F5F0E6', '#F0EDE5', '#F5EFE0', '#F0E5C8', '#E8DCC8', '#D8C8A8'].includes(colour);
  
  const imageUrl = brand ? `/bars/${getImageFilename(brand, flavour)}` : null;
  
  const handleClick = (e) => {
    if (onImageClick && imageUrl && !imgError) {
      e.stopPropagation();
      onImageClick(imageUrl, `${brand} ${flavour}`);
    }
  };
  
  if (imageUrl && !imgError) {
    if (fullWidth) {
      return (
        <img
          src={imageUrl}
          alt={`${brand} ${flavour}`}
          onError={() => setImgError(true)}
          onClick={handleClick}
          style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
            border: `1px solid rgba(0,0,0,0.08)`,
            cursor: onImageClick ? 'zoom-in' : 'default',
            display: 'block',
          }}
        />
      );
    }
    return (
      <img
        src={imageUrl}
        alt={`${brand} ${flavour}`}
        onError={() => setImgError(true)}
        onClick={handleClick}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.12,
          objectFit: 'cover',
          border: `1px solid rgba(0,0,0,0.08)`,
          flexShrink: 0,
          cursor: onImageClick ? 'zoom-in' : 'default',
        }}
      />
    );
  }
  
  if (fullWidth) {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: 'var(--radius-md)',
        background: colour,
        border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
      }} />
    );
  }
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size * 0.12,
      background: colour,
      border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
    }} />
  );
};

// Theme Toggle Component
const ThemeToggle = ({ isDark, setIsDark }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: theme.bgSecondary,
        border: `1px solid ${theme.border}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        zIndex: 1000,
        transition: 'all 0.2s ease',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

// Navigation Component
const Nav = ({ currentPage, setCurrentPage }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <nav style={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      background: theme.bgSecondary,
      borderTop: `1px solid ${theme.border}`,
      padding: '12px 16px max(12px, env(safe-area-inset-bottom))',
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
      }}>
        {[
          { id: 'home', label: 'Rankings' },
          { id: 'swipe', label: 'Rate' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              flex: 1,
              maxWidth: '160px',
              background: currentPage === item.id ? theme.accent : 'transparent',
              border: currentPage === item.id ? 'none' : `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: currentPage === item.id ? '#FFFFFF' : theme.textSecondary,
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Home Page
const HomePage = ({ snacks, setSelectedSnack, setCurrentPage, openLightbox, resetRankings }) => {
  const theme = useContext(ThemeContext);
  const [displayStat, setDisplayStat] = useState(() => {
    const saved = localStorage.getItem('snackranker-display-stat');
    return saved || 'protein';
  });
  
  // Save display stat preference
  useEffect(() => {
    localStorage.setItem('snackranker-display-stat', displayStat);
  }, [displayStat]);
  
  // Sort by rating (approval %), then by total votes as tiebreaker
  const sortedSnacks = [...snacks].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return (b.totalVotes || 0) - (a.totalVotes || 0);
  });
  const totalVotes = snacks.reduce((sum, s) => sum + (s.totalVotes || 0), 0);
  
  const statOptions = [
    { id: 'protein', label: 'Protein', unit: 'g', getValue: (s) => s.protein },
    { id: 'calories', label: 'Cals', unit: '', getValue: (s) => s.calories },
    { id: 'sugar', label: 'Sugar', unit: 'g', getValue: (s) => s.sugar },
    { id: 'fiber', label: 'Fibre', unit: 'g', getValue: (s) => s.fiber },
    { id: 'price', label: 'Price', unit: '', getValue: (s) => `$${s.price.toFixed(2)}` },
  ];
  
  const currentStat = statOptions.find(s => s.id === displayStat) || statOptions[0];
  
  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      paddingBottom: '80px',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-sm)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <h1 style={{
              fontFamily: '"Tanker", sans-serif',
              fontSize: 'var(--font-xxl)',
              fontWeight: 400,
              color: theme.text,
              margin: '0 0 4px',
            }}>
              SnackRanker
            </h1>
            <p style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              color: theme.textMuted,
              margin: 0,
            }}>
              {snacks.length} bars · {totalVotes} votes
            </p>
          </div>
          {totalVotes > 0 && (
            <button
              onClick={resetRankings}
              style={{
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                cursor: 'pointer',
                fontFamily: '"Manrope", sans-serif',
                fontSize: 'var(--font-xs)',
                color: theme.textMuted,
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      
      {/* Stat Selector */}
      <div style={{
        padding: '0 var(--spacing-sm) var(--spacing-sm)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {statOptions.map(stat => (
          <button
            key={stat.id}
            onClick={() => setDisplayStat(stat.id)}
            style={{
              background: displayStat === stat.id ? theme.accent : theme.bgTertiary,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-xs)',
              fontWeight: 600,
              color: displayStat === stat.id ? '#FFFFFF' : theme.textMuted,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {stat.label}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      <div style={{
        padding: '0 var(--spacing-sm)',
      }}>
        {sortedSnacks.map((snack, index) => (
          <div
            key={snack.id}
            onClick={() => {
              setSelectedSnack(snack);
              setCurrentPage('profile');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-sm)',
              marginBottom: '2px',
              background: theme.cardBg,
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Rank */}
            <div style={{
              width: '28px',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              color: index < 3 ? theme.accent : theme.textMuted,
              textAlign: 'center',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>

            {/* Flavour Image */}
            <div style={{ flexShrink: 0 }}>
              <FlavourCircle flavour={snack.flavour} brand={snack.brand} size={52} onImageClick={openLightbox} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: 'var(--font-md)',
                fontWeight: 600,
                color: theme.text,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {snack.flavour}
              </div>
              <div style={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: 'var(--font-xs)',
                color: theme.textMuted,
              }}>
                {snack.name} · {snack.brand}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flexShrink: 0,
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  color: theme.text,
                }}>
                  {typeof currentStat.getValue(snack) === 'string' 
                    ? currentStat.getValue(snack) 
                    : `${currentStat.getValue(snack)}${currentStat.unit}`}
                </div>
                <div style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-xs)',
                  color: theme.textMuted,
                }}>
                  {currentStat.label.toLowerCase()}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '44px' }}>
                <div style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  color: snack.totalVotes > 0 ? theme.accent : theme.textMuted,
                }}>
                  {snack.totalVotes > 0 ? `${snack.rating}%` : '—'}
                </div>
                <div style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-xs)',
                  color: theme.textMuted,
                }}>
                  {snack.totalVotes > 0 ? `${snack.totalVotes} votes` : 'no votes'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Swipe Page
const SwipePage = ({ snacks, setSnacks, setSelectedSnack, setCurrentPage, openLightbox }) => {
  const theme = useContext(ThemeContext);
  
  // Get user votes from localStorage
  const [userVotes, setUserVotes] = useState(() => {
    const saved = localStorage.getItem('snackranker-votes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });
  
  // Find bars that haven't been voted on yet
  const unvotedBars = snacks.filter(s => !(s.id in userVotes));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(null);
  const [touchCurrent, setTouchCurrent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const currentSnack = unvotedBars[currentIndex];
  const votedCount = Object.keys(userVotes).length;
  const totalBars = snacks.length;
  const progress = (votedCount / totalBars) * 100;
  
  // Calculate drag offset
  const dragOffset = isDragging && touchStart && touchCurrent 
    ? touchCurrent.x - touchStart.x 
    : 0;
  const dragRotation = dragOffset * 0.05;
  const dragOpacity = Math.max(0, 1 - Math.abs(dragOffset) / 300);
  
  // Save votes to localStorage
  useEffect(() => {
    localStorage.setItem('snackranker-votes', JSON.stringify(userVotes));
  }, [userVotes]);
  
  const handleVote = (liked) => {
    if (!currentSnack || isAnimating) return;
    
    setSwipeDirection(liked ? 'right' : 'left');
    setIsAnimating(true);
    
    setTimeout(() => {
      // Update user's vote
      const newVotes = { ...userVotes, [currentSnack.id]: liked };
      setUserVotes(newVotes);
      
      // Update bar's vote count
      setSnacks(prev => prev.map(s => {
        if (s.id === currentSnack.id) {
          // Remove old vote if exists, add new vote
          const hadPreviousVote = s.id in userVotes;
          const previousVote = userVotes[s.id];
          
          let newYesVotes = s.yesVotes || 0;
          let newTotalVotes = s.totalVotes || 0;
          
          if (hadPreviousVote) {
            // Remove previous vote
            if (previousVote) newYesVotes--;
            newTotalVotes--;
          }
          
          // Add new vote
          if (liked) newYesVotes++;
          newTotalVotes++;
          
          return {
            ...s,
            yesVotes: newYesVotes,
            totalVotes: newTotalVotes,
            rating: newTotalVotes > 0 ? Math.round((newYesVotes / newTotalVotes) * 100) : 0
          };
        }
        return s;
      }));
      
      setSwipeDirection(null);
      setIsAnimating(false);
      setIsDragging(false);
      setTouchStart(null);
      setTouchCurrent(null);
    }, 300);
  };
  
  // Touch handlers
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging || isAnimating) return;
    const touch = e.touches[0];
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchEnd = () => {
    if (!isDragging || isAnimating) return;
    
    const threshold = 100; // pixels needed to trigger swipe
    
    if (dragOffset > threshold) {
      handleVote(true); // Swipe right = yes
    } else if (dragOffset < -threshold) {
      handleVote(false); // Swipe left = no
    } else {
      // Reset if not swiped far enough
      setIsDragging(false);
      setTouchStart(null);
      setTouchCurrent(null);
    }
  };
  
  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    setTouchStart({ x: e.clientX, y: e.clientY });
    setTouchCurrent({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || isAnimating) return;
    setTouchCurrent({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    handleTouchEnd();
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      handleTouchEnd();
    }
  };
  
  const resetVotes = () => {
    if (window.confirm('Clear all your votes and start over?')) {
      setUserVotes({});
      setCurrentIndex(0);
      // Reset all bars to initial state
      setSnacks(prev => prev.map(s => ({
        ...s,
        yesVotes: 0,
        totalVotes: 0,
        rating: 0
      })));
    }
  };

  // All bars voted
  if (!currentSnack) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        padding: 'var(--spacing-xl) var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: 'var(--spacing-md)',
        }}>
          🎉
        </div>
        <h2 style={{
          fontFamily: '"Tanker", sans-serif',
          fontSize: 'var(--font-xl)',
          color: theme.text,
          margin: '0 0 var(--spacing-xs)',
        }}>
          All done!
        </h2>
        <p style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-sm)',
          color: theme.textMuted,
          margin: '0 0 var(--spacing-lg)',
        }}>
          You've rated all {totalBars} bars
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              background: theme.accent,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            View Rankings
          </button>
          <button
            onClick={resetVotes}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              color: theme.textMuted,
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // Calculate card transform
  const getCardTransform = () => {
    if (swipeDirection === 'left') {
      return 'translateX(-120%) rotate(-15deg)';
    }
    if (swipeDirection === 'right') {
      return 'translateX(120%) rotate(15deg)';
    }
    if (isDragging) {
      return `translateX(${dragOffset}px) rotate(${dragRotation}deg)`;
    }
    return 'translateX(0) rotate(0deg)';
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: theme.bg,
        padding: 'var(--spacing-xl) var(--spacing-sm) 100px',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xs)',
        }}>
          <h2 style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-xl)',
            color: theme.text,
            margin: 0,
          }}>
            Rate this bar
          </h2>
          <span style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-xs)',
            color: theme.textMuted,
          }}>
            {votedCount + 1} of {totalBars}
          </span>
        </div>
        
        {/* Progress bar */}
        <div style={{
          height: '4px',
          background: theme.bgTertiary,
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: theme.accent,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Swipe hint indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-sm)',
        marginBottom: 'var(--spacing-xs)',
        opacity: isDragging ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        <div style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-sm)',
          fontWeight: 600,
          color: dragOffset < -30 ? '#e74c3c' : theme.textMuted,
          transition: 'color 0.2s ease',
        }}>
          👎 NOPE
        </div>
        <div style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-sm)',
          fontWeight: 600,
          color: dragOffset > 30 ? theme.success : theme.textMuted,
          transition: 'color 0.2s ease',
        }}>
          YES! 👍
        </div>
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            background: theme.cardBg,
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
            transform: getCardTransform(),
            opacity: isAnimating ? 0 : (isDragging ? dragOpacity : 1),
            transition: isDragging ? 'none' : 'all 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
          }}
        >
          {/* Image */}
          <div 
            onClick={() => {
              if (!isDragging || Math.abs(dragOffset) < 10) {
                setSelectedSnack(currentSnack);
                setCurrentPage('profile');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <FlavourCircle 
              flavour={currentSnack.flavour} 
              brand={currentSnack.brand} 
              fullWidth 
              onImageClick={openLightbox} 
            />
          </div>
          
          {/* Info */}
          <div style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-lg)',
              fontWeight: 700,
              color: theme.text,
              margin: '0 0 2px',
            }}>
              {currentSnack.flavour}
            </h3>
            
            <p style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              color: theme.textMuted,
              margin: '0 0 var(--spacing-md)',
            }}>
              {currentSnack.name} · {currentSnack.brand}
            </p>

            {/* Macros row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--spacing-sm) 0',
              borderTop: `1px solid ${theme.border}`,
            }}>
              {[
                { label: 'Protein', value: `${currentSnack.protein}g`, highlight: true },
                { label: 'Calories', value: currentSnack.calories },
                { label: 'Sugar', value: `${currentSnack.sugar}g` },
                { label: 'Price', value: `$${currentSnack.price.toFixed(2)}` },
              ].map(macro => (
                <div key={macro.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: 'var(--font-md)',
                    fontWeight: 600,
                    color: macro.highlight ? theme.accent : theme.text,
                  }}>
                    {macro.value}
                  </div>
                  <div style={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: 'var(--font-xs)',
                    color: theme.textMuted,
                  }}>
                    {macro.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vote Buttons */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        paddingTop: 'var(--spacing-md)',
      }}>
        <button
          onClick={() => handleVote(false)}
          disabled={isAnimating}
          style={{
            flex: 1,
            background: theme.bgTertiary,
            border: `1px solid ${theme.border}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-md)',
            fontWeight: 600,
            color: theme.textSecondary,
            transition: 'all 0.15s ease',
            opacity: isAnimating ? 0.5 : 1,
          }}
        >
          👎 Nope
        </button>
        
        <button
          onClick={() => handleVote(true)}
          disabled={isAnimating}
          style={{
            flex: 1,
            background: theme.success,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-md)',
            fontWeight: 600,
            color: '#FFFFFF',
            transition: 'all 0.15s ease',
            opacity: isAnimating ? 0.5 : 1,
          }}
        >
          👍 Yes!
        </button>
      </div>
    </div>
  );
};

// Profile Page
const ProfilePage = ({ snack, snacks, setCurrentPage, openLightbox }) => {
  const theme = useContext(ThemeContext);
  
  if (!snack) return null;
  
  const rank = [...snacks].sort((a, b) => b.rating - a.rating).findIndex(s => s.id === snack.id) + 1;
  
  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      paddingBottom: '100px',
    }}>
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('home')}
        style={{
          position: 'absolute',
          top: 'var(--spacing-md)',
          left: 'var(--spacing-md)',
          background: theme.bgSecondary,
          border: `1px solid ${theme.border}`,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          cursor: 'pointer',
          zIndex: 100,
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-sm)',
          color: theme.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Back
      </button>

      {/* Hero */}
      <div style={{
        padding: 'var(--spacing-xl) var(--spacing-sm) var(--spacing-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          marginBottom: 'var(--spacing-md)',
        }}>
          <FlavourCircle flavour={snack.flavour} brand={snack.brand} fullWidth onImageClick={openLightbox} />
        </div>

        <div style={{
          display: 'inline-block',
          background: rank <= 3 ? theme.accent : theme.bgTertiary,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          marginBottom: 'var(--spacing-sm)',
        }}>
          <span style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-md)',
            color: rank <= 3 ? '#FFFFFF' : theme.textSecondary,
          }}>
            #{rank} of {snacks.length}
          </span>
        </div>

        <h1 style={{
          fontFamily: '"Tanker", sans-serif',
          fontSize: 'var(--font-xxl)',
          color: theme.text,
          margin: '0 0 4px',
        }}>
          {snack.flavour}
        </h1>
        
        <p style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-md)',
          color: theme.accent,
          margin: '0 0 4px',
          fontWeight: 600,
        }}>
          {snack.name}
        </p>
        
        <p style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-sm)',
          color: theme.textMuted,
          margin: 0,
        }}>
          {snack.brand}
        </p>
      </div>

      {/* Content */}
      <div style={{
        padding: '0 var(--spacing-sm)',
      }}>
        {/* Rating Card */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)',
          border: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: '"Tanker", sans-serif',
              fontSize: 'var(--font-xxl)',
              color: snack.totalVotes > 0 ? theme.accent : theme.textMuted,
            }}>
              {snack.totalVotes > 0 ? `${snack.rating}%` : '—'}
            </div>
            <div style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-xs)',
              color: theme.textMuted,
              textTransform: 'uppercase',
            }}>
              Approval
            </div>
          </div>
          <div style={{ width: '1px', background: theme.border }} />
          <div>
            <div style={{
              fontFamily: '"Tanker", sans-serif',
              fontSize: 'var(--font-xxl)',
              color: theme.text,
            }}>
              {snack.totalVotes || 0}
            </div>
            <div style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-xs)',
              color: theme.textMuted,
              textTransform: 'uppercase',
            }}>
              Votes
            </div>
          </div>
        </div>

        {/* Price */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)',
          border: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-sm)',
            color: theme.textMuted,
          }}>
            Price
          </span>
          <span style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-xl)',
            color: theme.accent,
          }}>
            ${snack.price.toFixed(2)}
          </span>
        </div>

        {/* Nutrition */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)',
          border: `1px solid ${theme.border}`,
        }}>
          <h3 style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-lg)',
            color: theme.text,
            margin: '0 0 var(--spacing-sm)',
          }}>
            Nutrition
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-xs)',
          }}>
            {[
              { label: 'Calories', value: snack.calories, unit: '' },
              { label: 'Protein', value: snack.protein, unit: 'g', highlight: true },
              { label: 'Sugar', value: snack.sugar, unit: 'g' },
              { label: 'Fibre', value: snack.fiber, unit: 'g' },
            ].map(item => (
              <div key={item.label} style={{
                background: item.highlight ? `${theme.accent}15` : theme.bgTertiary,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--spacing-sm)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: '"Tanker", sans-serif',
                  fontSize: 'var(--font-xl)',
                  color: item.highlight ? theme.accent : theme.text,
                }}>
                  {item.value}{item.unit}
                </div>
                <div style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-xs)',
                  color: theme.textMuted,
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          border: `1px solid ${theme.border}`,
        }}>
          <h3 style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-lg)',
            color: theme.text,
            margin: '0 0 var(--spacing-xs)',
          }}>
            About
          </h3>
          
          <p style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-sm)',
            color: theme.textSecondary,
            margin: 0,
            lineHeight: 1.6,
          }}>
            {snack.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [snacks, setSnacks] = useState(() => {
    const saved = localStorage.getItem('snackranker-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialSnacks;
      }
    }
    return initialSnacks;
  });
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('snackranker-theme');
    return saved === 'dark';
  });
  const [lightbox, setLightbox] = useState({ open: false, imageUrl: null, alt: '' });

  // Save snacks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('snackranker-data', JSON.stringify(snacks));
  }, [snacks]);
  
  // Save theme preference
  useEffect(() => {
    localStorage.setItem('snackranker-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const theme = isDark ? themes.dark : themes.light;
  
  const openLightbox = (imageUrl, alt) => {
    setLightbox({ open: true, imageUrl, alt });
  };
  
  const closeLightbox = () => {
    setLightbox({ open: false, imageUrl: null, alt: '' });
  };
  
  const resetRankings = () => {
    if (window.confirm('Reset all rankings to default? This cannot be undone.')) {
      setSnacks(initialSnacks);
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=tanker@400&display=swap');
        
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: ${theme.bgTertiary};
          color: ${theme.text};
          font-family: 'Manrope', sans-serif;
          -webkit-font-smoothing: antialiased;
          transition: background 0.3s ease, color 0.3s ease;
        }
        
        :root {
          --container-width: clamp(320px, 100vw, 540px);
          --spacing-xs: clamp(4px, 1vw, 8px);
          --spacing-sm: clamp(8px, 2vw, 12px);
          --spacing-md: clamp(12px, 3vw, 20px);
          --spacing-lg: clamp(20px, 4vw, 32px);
          --spacing-xl: clamp(32px, 6vw, 48px);
          --font-xs: clamp(10px, 2.5vw, 11px);
          --font-sm: clamp(11px, 2.8vw, 13px);
          --font-md: clamp(13px, 3.2vw, 15px);
          --font-lg: clamp(16px, 4vw, 20px);
          --font-xl: clamp(24px, 6vw, 32px);
          --font-xxl: clamp(28px, 8vw, 40px);
          --image-sm: clamp(44px, 12vw, 56px);
          --image-md: clamp(64px, 18vw, 88px);
          --image-lg: clamp(100px, 28vw, 140px);
          --radius-sm: clamp(4px, 1vw, 6px);
          --radius-md: clamp(8px, 2vw, 12px);
          --radius-lg: clamp(10px, 2.5vw, 16px);
        }
      `}</style>
      
      {lightbox.open && (
        <Lightbox 
          imageUrl={lightbox.imageUrl} 
          alt={lightbox.alt} 
          onClose={closeLightbox} 
        />
      )}
      
      <div style={{
        width: 'var(--container-width)',
        margin: '0 auto',
        minHeight: '100vh',
        background: theme.bg,
        position: 'relative',
        boxShadow: `0 0 40px ${theme.shadow}`,
      }}>
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        
        {currentPage === 'home' && (
          <HomePage 
            snacks={snacks} 
            setSelectedSnack={setSelectedSnack}
            setCurrentPage={setCurrentPage}
            openLightbox={openLightbox}
            resetRankings={resetRankings}
          />
        )}
        {currentPage === 'swipe' && (
          <SwipePage 
            snacks={snacks} 
            setSnacks={setSnacks}
            setSelectedSnack={setSelectedSnack}
            setCurrentPage={setCurrentPage}
            openLightbox={openLightbox}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage 
            snack={selectedSnack} 
            snacks={snacks}
            setCurrentPage={setCurrentPage}
            openLightbox={openLightbox}
          />
        )}
        
        <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </ThemeContext.Provider>
  );
}
