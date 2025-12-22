import React, { useState, createContext, useContext, useEffect } from 'react';

// Supabase configuration
const SUPABASE_URL = 'https://qzwejufuwmdabddixgxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6d2VqdWZ1d21kYWJkZGl4Z3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTAzMDIsImV4cCI6MjA4MTk4NjMwMn0.tTCDnYHKwnNeUbEjWmgmogt3qgv6XL-wWJmUvuU9mxk';

// Simple Supabase client
const supabase = {
  from: (table) => ({
    select: async (columns = '*') => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    upsert: async (rows) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(rows),
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },
    delete: async () => ({
      eq: async (column, value) => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        return { error: res.ok ? null : await res.json() };
      }
    }),
  }),
};

// Generate or retrieve visitor ID
const getVisitorId = () => {
  let visitorId = localStorage.getItem('snackranker-visitor-id');
  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('snackranker-visitor-id', visitorId);
  }
  return visitorId;
};

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


// Header Navigation Component
const Header = ({ currentPage, setCurrentPage, isDark, setIsDark }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      background: theme.bg,
      borderBottom: `1px solid ${theme.border}`,
      padding: 'var(--spacing-sm) var(--spacing-sm)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--spacing-sm)',
    }}>
      {/* Logo */}
      <div 
        onClick={() => setCurrentPage('home')}
        style={{
          fontFamily: '"Tanker", sans-serif',
          fontSize: 'var(--font-lg)',
          color: theme.text,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        SnackRanker
      </div>
      
      {/* Nav Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: theme.bgTertiary,
        borderRadius: 'var(--radius-sm)',
        padding: '4px',
      }}>
        {[
          { id: 'home', label: 'Rankings' },
          { id: 'swipe', label: 'Rate' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              background: currentPage === item.id ? theme.cardBg : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-xs)',
              fontWeight: 600,
              color: currentPage === item.id ? theme.text : theme.textMuted,
              transition: 'all 0.15s ease',
              boxShadow: currentPage === item.id ? `0 1px 3px ${theme.shadow}` : 'none',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          background: theme.bgTertiary,
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-xs)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          flexShrink: 0,
          width: '32px',
          height: '32px',
        }}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

// Footer Component
const Footer = ({ resetRankings, setCurrentPage, totalVotes }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <footer style={{
      borderTop: `1px solid ${theme.border}`,
      padding: 'var(--spacing-sm) var(--spacing-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: theme.bg,
    }}>
      <button
        onClick={() => setCurrentPage('about')}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-xs)',
          color: theme.textMuted,
        }}
      >
        About SnackRanker
      </button>
      
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
          Reset My Votes
        </button>
      )}
    </footer>
  );
};

// About Page
const AboutPage = ({ setCurrentPage }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <div style={{
      flex: 1,
      padding: 'var(--spacing-lg) var(--spacing-md)',
      background: theme.bg,
    }}>
      <h1 style={{
        fontFamily: '"Tanker", sans-serif',
        fontSize: 'var(--font-xl)',
        color: theme.text,
        margin: '0 0 var(--spacing-md)',
      }}>
        About SnackRanker
      </h1>
      
      <div style={{
        fontFamily: '"Manrope", sans-serif',
        fontSize: 'var(--font-sm)',
        color: theme.textSecondary,
        lineHeight: 1.7,
      }}>
        <p style={{ margin: '0 0 var(--spacing-md)' }}>
          <strong style={{ color: theme.text }}>Tired of wasting money on protein bars that taste like cardboard?</strong>
        </p>
        
        <p style={{ margin: '0 0 var(--spacing-md)' }}>
          SnackRanker helps you find the best protein bars based on real community votes. No sponsored reviews, no influencer deals — just honest opinions from people like you.
        </p>
        
        <h2 style={{
          fontFamily: '"Tanker", sans-serif',
          fontSize: 'var(--font-lg)',
          color: theme.text,
          margin: '0 0 var(--spacing-sm)',
        }}>
          How it works
        </h2>
        
        <p style={{ margin: '0 0 var(--spacing-sm)' }}>
          <strong style={{ color: theme.accent }}>1. Rate</strong> — Swipe through protein bars. Right for yes, left for no. Simple.
        </p>
        
        <p style={{ margin: '0 0 var(--spacing-sm)' }}>
          <strong style={{ color: theme.accent }}>2. Rankings</strong> — See which bars the community loves most, sorted by approval rating.
        </p>
        
        <p style={{ margin: '0 0 var(--spacing-md)' }}>
          <strong style={{ color: theme.accent }}>3. Decide</strong> — Use the rankings to find bars worth your money before you buy.
        </p>
        
        <h2 style={{
          fontFamily: '"Tanker", sans-serif',
          fontSize: 'var(--font-lg)',
          color: theme.text,
          margin: '0 0 var(--spacing-sm)',
        }}>
          Your vote matters
        </h2>
        
        <p style={{ margin: '0 0 var(--spacing-lg)' }}>
          Every vote shapes the rankings. You get one vote per bar, and you can change it anytime. The more people vote, the more accurate the rankings become.
        </p>
        
        <button
          onClick={() => setCurrentPage('swipe')}
          style={{
            background: theme.accent,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: '#FFFFFF',
          }}
        >
          Start Rating →
        </button>
      </div>
    </div>
  );
};

// Home Page
const HomePage = ({ snacks, setSelectedSnack, setCurrentPage, openLightbox }) => {
  const theme = useContext(ThemeContext);
  const [displayStat, setDisplayStat] = useState(() => {
    const saved = localStorage.getItem('snackranker-display-stat');
    return saved || 'protein';
  });
  
  // Save display stat preference
  useEffect(() => {
    localStorage.setItem('snackranker-display-stat', displayStat);
  }, [displayStat]);
  
  // Sort by rating with smarter logic:
  // 1. Bars with votes rank above bars with no votes
  // 2. Among bars with votes, sort by approval % (high to low)
  // 3. For same approval %, more votes = more confidence = rank higher
  // 4. Bars with 0% approval (all downvotes) rank at bottom based on how many downvotes
  const sortedSnacks = [...snacks].sort((a, b) => {
    const aVotes = a.totalVotes || 0;
    const bVotes = b.totalVotes || 0;
    const aRating = a.rating || 0;
    const bRating = b.rating || 0;
    
    // If neither has votes, maintain original order
    if (aVotes === 0 && bVotes === 0) return 0;
    
    // Bars with votes rank above bars without votes
    if (aVotes === 0) return 1;
    if (bVotes === 0) return -1;
    
    // Both have votes - sort by rating
    if (aRating !== bRating) return bRating - aRating;
    
    // Same rating - if both are 0%, fewer downvotes is better (less negative signal)
    if (aRating === 0 && bRating === 0) {
      return aVotes - bVotes; // fewer downvotes ranks higher
    }
    
    // Same positive rating - more votes = more confidence
    return bVotes - aVotes;
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
      flex: 1,
      background: theme.bg,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Subheader with stats */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-sm)',
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xs)',
        }}>
          <span style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-xs)',
            color: theme.textMuted,
          }}>
            {snacks.length} bars · {totalVotes} votes
          </span>
        </div>
        
        {/* Stat Selector */}
        <div style={{
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
  const visitorId = getVisitorId();
  
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
  
  // Shuffle array helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Create shuffled order on mount
  const [shuffledSnacks, setShuffledSnacks] = useState(() => shuffleArray(snacks));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(null);
  const [touchCurrent, setTouchCurrent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const currentSnack = shuffledSnacks[currentIndex];
  const hasVotedOnCurrent = currentSnack ? currentSnack.id in userVotes : false;
  const previousVoteOnCurrent = hasVotedOnCurrent ? (userVotes[currentSnack.id] ? '👍' : '👎') : null;
  const votedCount = Object.keys(userVotes).length;
  const totalBars = snacks.length;
  const progress = (currentIndex / totalBars) * 100;
  const allDone = currentIndex >= totalBars;
  
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
  
  const handleVote = async (liked) => {
    if (!currentSnack || isAnimating) return;
    
    setSwipeDirection(liked ? 'right' : 'left');
    setIsAnimating(true);
    
    // Save to Supabase
    try {
      await supabase.from('votes').upsert([{
        visitor_id: visitorId,
        bar_id: currentSnack.id,
        liked: liked,
        updated_at: new Date().toISOString(),
      }]);
    } catch (err) {
      console.error('Error saving vote:', err);
    }
    
    setTimeout(() => {
      // Check if changing vote
      const hadPreviousVote = currentSnack.id in userVotes;
      const previousVote = userVotes[currentSnack.id];
      
      // Update user's local vote tracking
      const newVotes = { ...userVotes, [currentSnack.id]: liked };
      setUserVotes(newVotes);
      
      // Update bar's vote count locally
      setSnacks(prev => prev.map(s => {
        if (s.id === currentSnack.id) {
          let newYesVotes = s.yesVotes || 0;
          let newTotalVotes = s.totalVotes || 0;
          
          if (hadPreviousVote) {
            if (previousVote) newYesVotes--;
            newTotalVotes--;
          }
          
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
      
      // Move to next card
      setCurrentIndex(prev => prev + 1);
      
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
    
    const threshold = 100;
    
    if (dragOffset > threshold) {
      handleVote(true);
    } else if (dragOffset < -threshold) {
      handleVote(false);
    } else {
      setIsDragging(false);
      setTouchStart(null);
      setTouchCurrent(null);
    }
  };
  
  // Mouse handlers
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
  
  const startOver = () => {
    setShuffledSnacks(shuffleArray(snacks));
    setCurrentIndex(0);
  };

  // All bars done
  if (allDone) {
    return (
      <div style={{
        flex: 1,
        background: theme.bg,
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '48px',
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
              padding: 'var(--spacing-sm) var(--spacing-md)',
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
            onClick={startOver}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              color: theme.textMuted,
            }}
          >
            Rate Again
          </button>
        </div>
        <p style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-xs)',
          color: theme.textMuted,
          marginTop: 'var(--spacing-md)',
        }}>
          Rating again will update your previous votes
        </p>
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
        flex: 1,
        background: theme.bg,
        padding: 'var(--spacing-sm)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress bar */}
      <div style={{
        marginBottom: 'var(--spacing-xs)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
        }}>
          <span style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-xs)',
            color: theme.textMuted,
          }}>
            {votedCount + 1} of {totalBars}
          </span>
          <span style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-xs)',
            color: theme.accent,
            fontWeight: 600,
          }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{
          height: '3px',
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

      {/* Previous vote indicator */}
      {hasVotedOnCurrent && !isDragging && (
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--spacing-xs)',
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-xs)',
          color: theme.textMuted,
        }}>
          Previously voted: {previousVoteOnCurrent} · swipe to update
        </div>
      )}

      {/* Swipe hint indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-xs)',
        minHeight: '20px',
        opacity: isDragging ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        <div style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-xs)',
          fontWeight: 600,
          color: dragOffset < -30 ? '#e74c3c' : theme.textMuted,
          transition: 'color 0.2s ease',
        }}>
          👎 NOPE
        </div>
        <div style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-xs)',
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
        minHeight: 0,
      }}>
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            background: theme.cardBg,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
            transform: getCardTransform(),
            opacity: isAnimating ? 0 : (isDragging ? dragOpacity : 1),
            transition: isDragging ? 'none' : 'all 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Image - takes available space */}
          <div 
            onClick={() => {
              if (!isDragging || Math.abs(dragOffset) < 10) {
                setSelectedSnack(currentSnack);
                setCurrentPage('profile');
              }
            }}
            style={{ 
              cursor: 'pointer',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src={`/bars/${getImageFilename(currentSnack.brand, currentSnack.flavour)}`}
              alt={`${currentSnack.brand} ${currentSnack.flavour}`}
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(`/bars/${getImageFilename(currentSnack.brand, currentSnack.flavour)}`, `${currentSnack.brand} ${currentSnack.flavour}`);
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'zoom-in',
              }}
            />
          </div>
          
          {/* Info - compact */}
          <div style={{ padding: 'var(--spacing-sm)' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'var(--spacing-xs)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-md)',
                  fontWeight: 700,
                  color: theme.text,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {currentSnack.flavour}
                </h3>
                <p style={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 'var(--font-xs)',
                  color: theme.textMuted,
                  margin: 0,
                }}>
                  {currentSnack.name} · {currentSnack.brand}
                </p>
              </div>
            </div>

            {/* Macros row - inline */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 'var(--spacing-xs)',
            }}>
              {[
                { label: 'Protein', value: `${currentSnack.protein}g`, highlight: true },
                { label: 'Cal', value: currentSnack.calories },
                { label: 'Sugar', value: `${currentSnack.sugar}g` },
                { label: 'Price', value: `$${currentSnack.price.toFixed(2)}` },
              ].map(macro => (
                <div key={macro.label} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 600,
                    color: macro.highlight ? theme.accent : theme.text,
                  }}>
                    {macro.value}
                  </div>
                  <div style={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: '9px',
                    color: theme.textMuted,
                    textTransform: 'uppercase',
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
        gap: 'var(--spacing-xs)',
        paddingTop: 'var(--spacing-sm)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => handleVote(false)}
          disabled={isAnimating}
          style={{
            flex: 1,
            background: theme.bgTertiary,
            border: `1px solid ${theme.border}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm)',
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
          onClick={() => setCurrentIndex(prev => prev + 1)}
          disabled={isAnimating}
          style={{
            padding: 'var(--spacing-sm)',
            background: 'transparent',
            border: `1px solid ${theme.border}`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-xs)',
            color: theme.textMuted,
            transition: 'all 0.15s ease',
            opacity: isAnimating ? 0.5 : 1,
          }}
        >
          Skip
        </button>
        
        <button
          onClick={() => handleVote(true)}
          disabled={isAnimating}
          style={{
            flex: 1,
            background: theme.success,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm)',
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
      flex: 1,
      background: theme.bg,
      overflow: 'auto',
    }}>
      {/* Header with back button and title */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-sm)',
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-sm)',
            color: theme.accent,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: 'var(--spacing-xs)',
          }}
        >
          ← Back to Rankings
        </button>
        
        {/* Name and Brand */}
        <h1 style={{
          fontFamily: '"Tanker", sans-serif',
          fontSize: 'var(--font-xl)',
          color: theme.text,
          margin: '0 0 2px',
        }}>
          {snack.flavour}
        </h1>
        
        <p style={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: 'var(--font-sm)',
          color: theme.textMuted,
          margin: 0,
        }}>
          {snack.name} · {snack.brand}
        </p>
      </div>

      {/* Image */}
      <div style={{ padding: 'var(--spacing-sm)' }}>
        <div style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: `1px solid ${theme.border}`,
        }}>
          <FlavourCircle flavour={snack.flavour} brand={snack.brand} fullWidth onImageClick={openLightbox} />
        </div>
      </div>

      {/* Rank + Rating Row - Compact */}
      <div style={{
        padding: '0 var(--spacing-sm) var(--spacing-sm)',
        display: 'flex',
        gap: 'var(--spacing-xs)',
      }}>
        <div style={{
          flex: 1,
          background: rank <= 3 ? theme.accent : theme.cardBg,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-sm)',
          border: rank <= 3 ? 'none' : `1px solid ${theme.border}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-lg)',
            color: rank <= 3 ? '#FFFFFF' : theme.text,
          }}>
            #{rank}
          </div>
          <div style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: '10px',
            color: rank <= 3 ? 'rgba(255,255,255,0.8)' : theme.textMuted,
            textTransform: 'uppercase',
          }}>
            Rank
          </div>
        </div>
        
        <div style={{
          flex: 1,
          background: theme.cardBg,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-sm)',
          border: `1px solid ${theme.border}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-lg)',
            color: snack.totalVotes > 0 ? theme.accent : theme.textMuted,
          }}>
            {snack.totalVotes > 0 ? `${snack.rating}%` : '—'}
          </div>
          <div style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: '10px',
            color: theme.textMuted,
            textTransform: 'uppercase',
          }}>
            Approval
          </div>
        </div>
        
        <div style={{
          flex: 1,
          background: theme.cardBg,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-sm)',
          border: `1px solid ${theme.border}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Tanker", sans-serif',
            fontSize: 'var(--font-lg)',
            color: theme.text,
          }}>
            {snack.totalVotes || 0}
          </div>
          <div style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: '10px',
            color: theme.textMuted,
            textTransform: 'uppercase',
          }}>
            Votes
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{
        padding: '0 var(--spacing-sm) var(--spacing-sm)',
        display: 'flex',
        gap: 'var(--spacing-xs)',
      }}>
        {[
          { label: 'Protein', value: `${snack.protein}g`, highlight: true },
          { label: 'Calories', value: snack.calories },
          { label: 'Sugar', value: `${snack.sugar}g` },
          { label: 'Price', value: `$${snack.price.toFixed(2)}` },
        ].map(item => (
          <div key={item.label} style={{
            flex: 1,
            background: item.highlight ? `${theme.accent}15` : theme.cardBg,
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--spacing-sm)',
            border: `1px solid ${item.highlight ? theme.accent + '30' : theme.border}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              color: item.highlight ? theme.accent : theme.text,
            }}>
              {item.value}
            </div>
            <div style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: '9px',
              color: theme.textMuted,
              textTransform: 'uppercase',
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div style={{
        padding: '0 var(--spacing-sm) var(--spacing-lg)',
      }}>
        <div style={{
          background: theme.cardBg,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-sm)',
          border: `1px solid ${theme.border}`,
        }}>
          <h3 style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: theme.text,
            margin: '0 0 var(--spacing-xs)',
          }}>
            About
          </h3>
          <p style={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 'var(--font-xs)',
            color: theme.textSecondary,
            margin: 0,
            lineHeight: 1.5,
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
  const [snacks, setSnacks] = useState(initialSnacks);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('snackranker-theme');
    return saved === 'dark';
  });
  const [lightbox, setLightbox] = useState({ open: false, imageUrl: null, alt: '' });
  const [isLoading, setIsLoading] = useState(true);

  const visitorId = getVisitorId();

  // Fetch all votes from Supabase on load
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const { data: votes, error } = await supabase.from('votes').select('*');
        
        if (error) {
          console.error('Error fetching votes:', error);
          setIsLoading(false);
          return;
        }

        // Aggregate votes by bar
        const voteCounts = {};
        votes.forEach(vote => {
          if (!voteCounts[vote.bar_id]) {
            voteCounts[vote.bar_id] = { yesVotes: 0, totalVotes: 0 };
          }
          voteCounts[vote.bar_id].totalVotes++;
          if (vote.liked) {
            voteCounts[vote.bar_id].yesVotes++;
          }
        });

        // Update snacks with vote data
        setSnacks(prev => prev.map(s => {
          const counts = voteCounts[s.id] || { yesVotes: 0, totalVotes: 0 };
          return {
            ...s,
            yesVotes: counts.yesVotes,
            totalVotes: counts.totalVotes,
            rating: counts.totalVotes > 0 ? Math.round((counts.yesVotes / counts.totalVotes) * 100) : 0
          };
        }));
      } catch (err) {
        console.error('Error:', err);
      }
      setIsLoading(false);
    };

    fetchVotes();
  }, []);

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
  
  const resetRankings = async () => {
    if (window.confirm('Reset all rankings to default? This cannot be undone.')) {
      // Note: This only resets local view, not the database
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
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          isDark={isDark} 
          setIsDark={setIsDark} 
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {currentPage === 'home' && (
            <HomePage 
              snacks={snacks} 
              setSelectedSnack={setSelectedSnack}
              setCurrentPage={setCurrentPage}
              openLightbox={openLightbox}
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
          {currentPage === 'about' && (
            <AboutPage setCurrentPage={setCurrentPage} />
          )}
        </div>
        
        {(currentPage === 'home' || currentPage === 'about') && (
          <Footer 
            resetRankings={resetRankings} 
            setCurrentPage={setCurrentPage}
            totalVotes={snacks.reduce((sum, s) => sum + (s.totalVotes || 0), 0)}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}
