import React, { useState, useEffect } from 'react';

// Flavour to colour mapping
const flavourColours = {
  'chocolate': '#4a3728',
  'brownie': '#5c4033',
  'cookie': '#d4a574',
  'cookies': '#d4a574',
  'cream': '#f5f5dc',
  'peanut': '#c4a35a',
  'peanut butter': '#c4a35a',
  'caramel': '#ffd700',
  'salted caramel': '#daa520',
  'coconut': '#fffef0',
  'churro': '#d2a679',
  'cinnamon': '#d2691e',
  'mint': '#98fb98',
  'blueberry': '#4169e1',
  'birthday': '#ff69b4',
  'cake': '#ffb6c1',
  'banana': '#ffe135',
  'white chocolate': '#faf0e6',
  'vanilla': '#f3e5ab',
  'crisp': '#ffefd5',
  'cashew': '#e6be8a',
  'dough': '#e8d4a8',
  'oreo': '#2d2d2d',
  'sea salt': '#87ceeb',
  'default': '#888888',
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

// Real protein bar data from CSV
const initialSnacks = [
  { id: 1, name: 'Built Puff', brand: 'Built', flavour: 'Brownie Batter', protein: 17, calories: 130, sugar: 4, fiber: 4, price: 4.99, description: 'Marshmallow-style protein bar, chocolate coated', rating: 1500, votes: 0 },
  { id: 2, name: 'Built Puff', brand: 'Built', flavour: 'Coconut', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Coconut-flavoured puff protein bar', rating: 1500, votes: 0 },
  { id: 3, name: 'Built Puff', brand: 'Built', flavour: 'Churro', protein: 17, calories: 140, sugar: 4, fiber: 4, price: 4.99, description: 'Cinnamon churro-inspired puff bar', rating: 1500, votes: 0 },
  { id: 4, name: 'Built Puff', brand: 'Built', flavour: 'Salted Caramel', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Sweet caramel with salt, marshmallow texture', rating: 1500, votes: 0 },
  { id: 5, name: 'Built Puff', brand: 'Built', flavour: 'Mint Chocolate Chip', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Mint chocolate puff protein bar', rating: 1500, votes: 0 },
  { id: 6, name: 'Built Puff', brand: 'Built', flavour: 'Cookies & Cream', protein: 17, calories: 140, sugar: 5, fiber: 3, price: 4.99, description: 'Cookies & cream marshmallow protein bar', rating: 1500, votes: 0 },
  { id: 7, name: 'RXBAR', brand: 'RXBAR', flavour: 'Peanut Butter Chocolate', protein: 12, calories: 210, sugar: 15, fiber: 5, price: 3.49, description: 'Minimal-ingredient bar with dates & egg whites', rating: 1500, votes: 0 },
  { id: 8, name: 'RXBAR', brand: 'RXBAR', flavour: 'Chocolate Sea Salt', protein: 12, calories: 210, sugar: 14, fiber: 5, price: 3.49, description: 'Cocoa-based bar with sea salt', rating: 1500, votes: 0 },
  { id: 9, name: 'RXBAR', brand: 'RXBAR', flavour: 'Blueberry', protein: 12, calories: 210, sugar: 15, fiber: 5, price: 3.49, description: 'Fruit-forward protein bar', rating: 1500, votes: 0 },
  { id: 10, name: 'Diesel Protein Bar', brand: 'Perfect Sports', flavour: 'Cookies & Cream', protein: 18, calories: 190, sugar: 2, fiber: 9, price: 3.99, description: 'Whey-based high-protein bar', rating: 1500, votes: 0 },
  { id: 11, name: 'Diesel Protein Bar', brand: 'Perfect Sports', flavour: 'Chocolate Peanut Butter', protein: 18, calories: 190, sugar: 2, fiber: 9, price: 3.99, description: 'Chocolate PB whey protein bar', rating: 1500, votes: 0 },
  { id: 12, name: 'Diesel Protein Bar', brand: 'Perfect Sports', flavour: 'Cookie Dough', protein: 18, calories: 190, sugar: 2, fiber: 9, price: 3.99, description: 'Cookie dough flavoured protein bar', rating: 1500, votes: 0 },
  { id: 13, name: 'ONE Bar', brand: 'ONE Brands', flavour: 'Chocolate Chip Cookie Dough', protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: 'High-protein, low sugar bar', rating: 1500, votes: 0 },
  { id: 14, name: 'ONE Bar', brand: 'ONE Brands', flavour: 'Birthday Cake', protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: 'Birthday cake flavoured protein bar', rating: 1500, votes: 0 },
  { id: 15, name: 'ONE Bar', brand: 'ONE Brands', flavour: "Hershey's Cookies & Cream", protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: "Licensed Hershey's flavour", rating: 1500, votes: 0 },
  { id: 16, name: 'ONE Bar', brand: 'ONE Brands', flavour: "Reese's Peanut Butter", protein: 20, calories: 220, sugar: 1, fiber: 9, price: 3.99, description: "Reese's PB flavour protein bar", rating: 1500, votes: 0 },
  { id: 17, name: 'Alani Nu Protein Bar', brand: 'Alani Nu', flavour: 'Chocolate Cake', protein: 15, calories: 170, sugar: 3, fiber: 7, price: 3.99, description: 'Dessert-style protein bar', rating: 1500, votes: 0 },
  { id: 18, name: 'Alani Nu Protein Bar', brand: 'Alani Nu', flavour: 'Peanut Butter Chocolate', protein: 15, calories: 170, sugar: 3, fiber: 7, price: 3.99, description: 'Sweet PB chocolate flavour', rating: 1500, votes: 0 },
  { id: 19, name: 'Barebells', brand: 'Barebells', flavour: 'Cookies & Cream', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Soft milk-chocolate coated bar', rating: 1500, votes: 0 },
  { id: 20, name: 'Barebells', brand: 'Barebells', flavour: 'Creamy Crisp', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Crispy texture with milk chocolate', rating: 1500, votes: 0 },
  { id: 21, name: 'Barebells', brand: 'Barebells', flavour: 'Caramel Cashew', protein: 20, calories: 200, sugar: 2, fiber: 6, price: 4.79, description: 'Caramel and cashew flavour', rating: 1500, votes: 0 },
  { id: 22, name: 'Barebells', brand: 'Barebells', flavour: 'Chocolate Dough', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Cookie-dough inspired bar', rating: 1500, votes: 0 },
  { id: 23, name: 'Barebells', brand: 'Barebells', flavour: 'Birthday Cake', protein: 20, calories: 200, sugar: 1, fiber: 6, price: 4.79, description: 'Cake-style protein bar', rating: 1500, votes: 0 },
  { id: 24, name: 'TRUBAR', brand: 'TRUBAR', flavour: 'Oh Oh Cookie Dough', protein: 12, calories: 230, sugar: 12, fiber: 4, price: 3.49, description: 'Plant-based protein bar', rating: 1500, votes: 0 },
  { id: 25, name: 'TRUBAR', brand: 'TRUBAR', flavour: "Don't Go Bananas", protein: 12, calories: 230, sugar: 11, fiber: 4, price: 3.49, description: 'Banana-based vegan protein bar', rating: 1500, votes: 0 },
  { id: 26, name: 'TRUBAR', brand: 'TRUBAR', flavour: 'Get In My Belly', protein: 12, calories: 230, sugar: 12, fiber: 4, price: 3.49, description: 'Peanut butter chocolate vegan bar', rating: 1500, votes: 0 },
  { id: 27, name: 'Grenade Carb Killa', brand: 'Grenade', flavour: 'Oreo', protein: 20, calories: 210, sugar: 1, fiber: 8, price: 4.49, description: 'Low-sugar, layered protein bar', rating: 1500, votes: 0 },
  { id: 28, name: 'Grenade Carb Killa', brand: 'Grenade', flavour: 'White Chocolate Salted Peanut', protein: 20, calories: 210, sugar: 1, fiber: 8, price: 4.49, description: 'Sweet-salty high protein bar', rating: 1500, votes: 0 },
  { id: 29, name: 'Quest Bar', brand: 'Quest', flavour: 'Chocolate Chip Cookie Dough', protein: 20, calories: 190, sugar: 1, fiber: 14, price: 6.49, description: 'High fibre, low sugar protein bar', rating: 1500, votes: 0 },
  { id: 30, name: 'Quest Bar', brand: 'Quest', flavour: 'Cookies & Cream', protein: 20, calories: 190, sugar: 1, fiber: 14, price: 6.49, description: 'Whey + fibre protein bar', rating: 1500, votes: 0 },
  { id: 31, name: 'Legendary Protein Pastry', brand: 'Legendary Foods', flavour: 'Cinnamon Roll', protein: 20, calories: 200, sugar: 2, fiber: 7, price: 4.99, description: 'Pop-tart style protein pastry', rating: 1500, votes: 0 },
  { id: 32, name: 'Legendary Protein Pastry', brand: 'Legendary Foods', flavour: 'Chocolate Cake', protein: 20, calories: 200, sugar: 2, fiber: 7, price: 4.99, description: 'Soft-baked protein pastry', rating: 1500, votes: 0 },
  { id: 33, name: 'Warrior Crunch', brand: 'Warrior', flavour: 'Chocolate Chip Cookie Dough', protein: 20, calories: 220, sugar: 2, fiber: 7, price: 4.49, description: 'Crispy layered protein bar', rating: 1500, votes: 0 },
  { id: 34, name: 'Love Good Fats', brand: 'Love Good Fats', flavour: 'Chocolate Chip Cookie Dough', protein: 10, calories: 220, sugar: 2, fiber: 8, price: 3.99, description: 'Keto-friendly fat-forward bar', rating: 1500, votes: 0 },
  { id: 35, name: 'SimplyProtein Crispy', brand: 'SimplyProtein', flavour: 'Peanut Butter Chocolate', protein: 13, calories: 150, sugar: 1, fiber: 5, price: 2.75, description: 'Crispy soy-based protein bars', rating: 1500, votes: 0 },
];

// ELO rating calculation
const calculateElo = (winnerRating, loserRating, kFactor = 32) => {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
  return {
    newWinnerRating: Math.round(winnerRating + kFactor * (1 - expectedWinner)),
    newLoserRating: Math.round(loserRating + kFactor * (0 - expectedLoser))
  };
};

// Colour circle component
const FlavourCircle = ({ flavour, size = 48 }) => {
  const colour = getFlavourColour(flavour);
  const isLight = ['#fffef0', '#f5f5dc', '#faf0e6', '#f3e5ab', '#ffefd5', '#e8d4a8'].includes(colour);
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, ${colour}, ${colour}dd)`,
      border: isLight ? '2px solid rgba(0,0,0,0.1)' : '2px solid rgba(255,255,255,0.1)',
      boxShadow: `0 4px 12px ${colour}44, inset 0 2px 4px rgba(255,255,255,0.2)`,
      flexShrink: 0,
    }} />
  );
};

// Navigation Component
const Nav = ({ currentPage, setCurrentPage }) => (
  <nav style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,200,87,0.2)',
    padding: '12px 0 max(12px, env(safe-area-inset-bottom))',
    zIndex: 1000,
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      {[
        { id: 'home', icon: '🏆', label: 'Rankings' },
        { id: 'swipe', icon: '⚡', label: 'Rate' },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id)}
          style={{
            background: currentPage === item.id 
              ? 'linear-gradient(135deg, #ffc857 0%, #e09f3e 100%)' 
              : 'transparent',
            border: 'none',
            borderRadius: '16px',
            padding: '10px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: currentPage === item.id ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <span style={{ fontSize: '22px' }}>{item.icon}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: currentPage === item.id ? '#0a0a0a' : '#888',
            textTransform: 'uppercase',
          }}>{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

// Home Page - Rankings
const HomePage = ({ snacks, setSelectedSnack, setCurrentPage }) => {
  const sortedSnacks = [...snacks].sort((a, b) => b.rating - a.rating);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      paddingBottom: '100px',
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(255,200,87,0.15) 0%, transparent 100%)',
        padding: '60px 20px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          right: '-50%',
          bottom: '-50%',
          background: 'radial-gradient(circle at 50% 0%, rgba(255,200,87,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <h1 style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: 'clamp(48px, 12vw, 72px)',
          fontWeight: 400,
          letterSpacing: '4px',
          color: '#ffc857',
          margin: 0,
          textShadow: '0 4px 30px rgba(255,200,87,0.3)',
          lineHeight: 1,
        }}>
          SNACKRANKER
        </h1>
        <p style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '13px',
          color: '#666',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginTop: '12px',
        }}>
          The Definitive Protein Bar Rankings
        </p>
        <p style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '11px',
          color: '#444',
          marginTop: '8px',
        }}>
          {snacks.length} bars • Tap to view details
        </p>
      </div>

      {/* Rankings List */}
      <div style={{
        padding: '0 16px',
        maxWidth: '600px',
        margin: '0 auto',
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
              gap: '16px',
              padding: '16px',
              marginBottom: '8px',
              background: index === 0 
                ? 'linear-gradient(135deg, rgba(255,200,87,0.15) 0%, rgba(255,200,87,0.05) 100%)'
                : 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              border: index === 0 
                ? '1px solid rgba(255,200,87,0.3)' 
                : '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: `slideIn 0.4s ease-out ${index * 0.03}s both`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(8px)';
              e.currentTarget.style.background = 'rgba(255,200,87,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = index === 0 
                ? 'linear-gradient(135deg, rgba(255,200,87,0.15) 0%, rgba(255,200,87,0.05) 100%)'
                : 'rgba(255,255,255,0.03)';
            }}
          >
            {/* Rank */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: index === 0 
                ? 'linear-gradient(135deg, #ffc857 0%, #e09f3e 100%)'
                : index === 1
                ? 'linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)'
                : index === 2
                ? 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)'
                : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              fontSize: '18px',
              color: index < 3 ? '#0a0a0a' : '#fff',
              fontWeight: 400,
              flexShrink: 0,
            }}>
              {index + 1}
            </div>

            {/* Flavour Circle */}
            <FlavourCircle flavour={snack.flavour} size={44} />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {snack.name}
              </div>
              <div style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '10px',
                color: '#888',
                marginBottom: '2px',
              }}>
                {snack.flavour}
              </div>
              <div style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '10px',
                color: '#555',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {snack.brand} • {snack.protein}g protein
              </div>
            </div>

            {/* Rating */}
            <div style={{
              textAlign: 'right',
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: '"Bebas Neue", Impact, sans-serif',
                fontSize: '22px',
                color: '#ffc857',
                lineHeight: 1,
              }}>
                {snack.rating}
              </div>
              <div style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '9px',
                color: '#444',
                textTransform: 'uppercase',
              }}>
                ELO
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Swipe Page
const SwipePage = ({ snacks, setSnacks, setSelectedSnack, setCurrentPage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compareIndex, setCompareIndex] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  const currentSnack = snacks[currentIndex];
  const compareSnack = snacks[compareIndex];

  const getNextPair = () => {
    const newCurrent = Math.floor(Math.random() * snacks.length);
    let newCompare = Math.floor(Math.random() * snacks.length);
    while (newCompare === newCurrent) {
      newCompare = Math.floor(Math.random() * snacks.length);
    }
    setCurrentIndex(newCurrent);
    setCompareIndex(newCompare);
  };

  const handleVote = (winner, loser) => {
    setAnimating(true);
    setDirection(winner === 'current' ? 'left' : 'right');
    
    setTimeout(() => {
      const winnerSnack = winner === 'current' ? currentSnack : compareSnack;
      const loserSnack = winner === 'current' ? compareSnack : currentSnack;
      
      const { newWinnerRating, newLoserRating } = calculateElo(
        winnerSnack.rating,
        loserSnack.rating
      );

      setSnacks(prev => prev.map(s => {
        if (s.id === winnerSnack.id) return { ...s, rating: newWinnerRating, votes: s.votes + 1 };
        if (s.id === loserSnack.id) return { ...s, rating: newLoserRating, votes: s.votes + 1 };
        return s;
      }));

      setAnimating(false);
      setDirection(null);
      getNextPair();
    }, 300);
  };

  const handleSkip = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      getNextPair();
    }, 200);
  };

  const SnackCard = ({ snack, side }) => (
    <div
      onClick={() => {
        setSelectedSnack(snack);
        setCurrentPage('profile');
      }}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        borderRadius: '24px',
        padding: '20px 16px',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: animating && direction === side ? `translateX(${side === 'left' ? '-100%' : '100%'}) rotate(${side === 'left' ? '-10deg' : '10deg'})` : 'translateX(0)',
        opacity: animating ? 0 : 1,
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <FlavourCircle flavour={snack.flavour} size={70} />
      </div>
      
      <h3 style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '15px',
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 4px',
        textAlign: 'center',
      }}>
        {snack.name}
      </h3>
      
      <p style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '10px',
        color: '#888',
        margin: '0 0 4px',
        textAlign: 'center',
      }}>
        {snack.flavour}
      </p>
      
      <p style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '9px',
        color: '#555',
        margin: '0 0 14px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {snack.brand}
      </p>

      {/* Macros Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px',
      }}>
        {[
          { label: 'Protein', value: `${snack.protein}g`, highlight: true },
          { label: 'Calories', value: snack.calories },
          { label: 'Sugar', value: `${snack.sugar}g` },
          { label: 'Fibre', value: `${snack.fiber}g` },
        ].map(macro => (
          <div key={macro.label} style={{
            background: macro.highlight ? 'rgba(255,200,87,0.15)' : 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              fontSize: '18px',
              color: macro.highlight ? '#ffc857' : '#fff',
            }}>
              {macro.value}
            </div>
            <div style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '8px',
              color: '#555',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {macro.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '10px',
        color: '#ffc857',
        textAlign: 'center',
        marginTop: '10px',
      }}>
        ${snack.price.toFixed(2)} CAD
      </div>

      <div style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '9px',
        color: '#444',
        textAlign: 'center',
        marginTop: '4px',
      }}>
        ELO: {snack.rating}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '50px 12px 120px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: '28px',
          color: '#ffc857',
          margin: '0 0 8px',
          letterSpacing: '2px',
        }}>
          WHICH IS BETTER?
        </h2>
        <p style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: '11px',
          color: '#666',
        }}>
          Tap card for details • Vote to rank
        </p>
      </div>

      {/* VS Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '8px',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto 24px',
      }}>
        <SnackCard snack={currentSnack} side="left" />
        
        <div style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: '24px',
          color: '#333',
          padding: '0 4px',
        }}>
          VS
        </div>
        
        <SnackCard snack={compareSnack} side="right" />
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        maxWidth: '400px',
        margin: '0 auto',
      }}>
        <button
          onClick={() => handleVote('current', 'compare')}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '14px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '20px' }}>👆</span>
          <span style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
          }}>LEFT WINS</span>
        </button>

        <button
          onClick={handleSkip}
          style={{
            width: '60px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <span style={{ fontSize: '20px' }}>⏭️</span>
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '9px',
            color: '#666',
          }}>SKIP</span>
        </button>

        <button
          onClick={() => handleVote('compare', 'current')}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '14px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '20px' }}>👆</span>
          <span style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
          }}>RIGHT WINS</span>
        </button>
      </div>
    </div>
  );
};

// Profile Page
const ProfilePage = ({ snack, snacks, setCurrentPage }) => {
  if (!snack) return null;
  
  const rank = [...snacks].sort((a, b) => b.rating - a.rating).findIndex(s => s.id === snack.id) + 1;
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      paddingBottom: '100px',
    }}>
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('home')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 16px',
          cursor: 'pointer',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: '"Space Mono", monospace',
          fontSize: '12px',
          color: '#888',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        ← Back
      </button>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(255,200,87,0.2) 0%, transparent 100%)',
        padding: '80px 20px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <FlavourCircle flavour={snack.flavour} size={100} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: rank <= 3 ? 'linear-gradient(135deg, #ffc857 0%, #e09f3e 100%)' : 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '6px 16px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: '16px',
            color: rank <= 3 ? '#0a0a0a' : '#fff',
          }}>
            #{rank}
          </span>
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '11px',
            color: rank <= 3 ? '#0a0a0a' : '#888',
            textTransform: 'uppercase',
          }}>
            of {snacks.length}
          </span>
        </div>

        <h1 style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: '36px',
          color: '#fff',
          margin: '0 0 4px',
          letterSpacing: '2px',
        }}>
          {snack.name}
        </h1>
        
        <p style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '16px',
          color: '#ffc857',
          margin: '0 0 4px',
        }}>
          {snack.flavour}
        </p>
        
        <p style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '14px',
          color: '#666',
          margin: 0,
        }}>
          {snack.brand}
        </p>
      </div>

      {/* Stats */}
      <div style={{
        padding: '0 20px',
        maxWidth: '500px',
        margin: '0 auto',
      }}>
        {/* ELO Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,200,87,0.15) 0%, rgba(255,200,87,0.05) 100%)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '16px',
          border: '1px solid rgba(255,200,87,0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              fontSize: '48px',
              color: '#ffc857',
              lineHeight: 1,
            }}>
              {snack.rating}
            </div>
            <div style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '11px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginTop: '4px',
            }}>
              ELO Rating
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,200,87,0.2)' }} />
          <div>
            <div style={{
              fontFamily: '"Bebas Neue", Impact, sans-serif',
              fontSize: '48px',
              color: '#fff',
              lineHeight: 1,
            }}>
              {snack.votes}
            </div>
            <div style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '11px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginTop: '4px',
            }}>
              Votes
            </div>
          </div>
        </div>

        {/* Price */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '12px',
            color: '#888',
            textTransform: 'uppercase',
          }}>
            Price
          </span>
          <span style={{
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: '28px',
            color: '#ffc857',
          }}>
            ${snack.price.toFixed(2)} CAD
          </span>
        </div>

        {/* Macros */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h3 style={{
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: '18px',
            color: '#888',
            margin: '0 0 16px',
            letterSpacing: '2px',
          }}>
            NUTRITION FACTS
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            {[
              { label: 'Calories', value: snack.calories, unit: '' },
              { label: 'Protein', value: snack.protein, unit: 'g', highlight: true },
              { label: 'Sugar', value: snack.sugar, unit: 'g' },
              { label: 'Fibre', value: snack.fiber, unit: 'g' },
            ].map(item => (
              <div key={item.label} style={{
                background: item.highlight ? 'rgba(255,200,87,0.1)' : 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: '"Bebas Neue", Impact, sans-serif',
                  fontSize: '28px',
                  color: item.highlight ? '#ffc857' : '#fff',
                }}>
                  {item.value}{item.unit}
                </div>
                <div style={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '10px',
                  color: '#555',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h3 style={{
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: '18px',
            color: '#888',
            margin: '0 0 12px',
            letterSpacing: '2px',
          }}>
            DESCRIPTION
          </h3>
          
          <p style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '14px',
            color: '#aaa',
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
  const [snacks, setSnacks] = useState(initialSnacks);
  const [selectedSnack, setSelectedSnack] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #0a0a0a;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      {currentPage === 'home' && (
        <HomePage 
          snacks={snacks} 
          setSelectedSnack={setSelectedSnack}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'swipe' && (
        <SwipePage 
          snacks={snacks} 
          setSnacks={setSnacks}
          setSelectedSnack={setSelectedSnack}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage 
          snack={selectedSnack} 
          snacks={snacks}
          setCurrentPage={setCurrentPage}
        />
      )}
      
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
}
