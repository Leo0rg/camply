import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 260px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: white;
  margin: 0 auto;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(238, 88, 6, 0.15);
  }

  @media (max-width: 1200px) {
    max-width: 260px;
    min-height: 220px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 180px;
  }

  @media (max-width: 576px) {
    max-width: 100%;
    min-height: 140px;
    border-radius: 8px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  object-position: center;
  display: block;
  transition: transform 0.5s ease;
  background-color: white;
  padding: 10px;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #eee;
  transition: all 0.3s ease;
`;

const ClickableArea = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;
  height: 100%;
`;

const CardTitle = styled.h3`
  font-family: 'WADIK', sans-serif;
  font-weight: 600;
  color: #131C3F;
  margin: 0.25rem 0;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardPrice = styled.div`
  font-family: 'WADIK', sans-serif;
  font-size: 1.3rem;
  color: #EE5806;
  font-weight: 700;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  
  &:after {
    content: ' ₽';
    font-size: 1rem;
    margin-left: 0.25rem;
    opacity: 0.8;
  }
`;

const Stars = styled.div`
  display: inline-flex;
  gap: 3px;
  margin-top: 6px;
  font-size: 0.9rem;
  line-height: 1;
`;

const QuantitySelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const QuantityDisplay = styled.span`
  color: white;
  font-size: 14px;
`;

const BuyButton = styled.button`
  background-color: #EE5806;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  font-family: 'WADIK', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  z-index: 5;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(238, 88, 6, 0.25);
  
  &:hover {
    background-color: #ff6a1a;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(238, 88, 6, 0.35);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(238, 88, 6, 0.3);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ProductCard = ({ product, onAddToCart, isAdded, cartItem, updateQuantity }) => {

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (cartItem) {
      updateQuantity(cartItem.product, newQuantity);
    }
  };

  // Определяем URL изображения
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Обрабатываем различные варианты путей к изображениям
  let imageUrl;
  if (!product.image) {
    // Если изображения нет, используем плейсхолдер
    imageUrl = 'https://via.placeholder.com/300x300/f6ebbf/131C3F?text=CAMPLY';
  } else if (product.image.startsWith('/uploads/')) {
    // Если путь начинается с /uploads/, это относительный путь к файлу в папке public
    // Для React-приложения в режиме разработки нужно добавить полный URL сервера
    imageUrl = `${apiUrl}${product.image}`;
  } else if (product.image.startsWith('/')) {
    // Если начинается с /, но не с /uploads/, это путь относительно API
    imageUrl = `${apiUrl}${product.image}`;
  } else {
    // Иначе это полный URL или другой формат пути
    imageUrl = product.image;
  }
  
  console.log('ProductCard: image path =', product.image, 'resolved to =', imageUrl);

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const star = '★';
    const halfStar = '☆';
    return (
      <Stars aria-label={`Рейтинг ${rating} из 5`}>
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f${i}`} style={{ color: '#FFC107' }}>{star}</span>
        ))}
        {half === 1 && <span style={{ color: '#FFC107' }}>{halfStar}</span>}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e${i}`} style={{ color: '#DDD' }}>{star}</span>
        ))}
      </Stars>
    );
  };

  return (
    <Card>
      <ClickableArea to={`/product/${product._id}`}>
        <CardImage src={imageUrl} alt={product.name} />
        <CardBody>
          <CardTitle>{product.name}</CardTitle>
          {renderStars(product.rating)}
          <CardPrice>{product.price}</CardPrice>
        </CardBody>
      </ClickableArea>
      {isAdded ? (
        <QuantitySelector 
        style={{ 
          position: 'absolute', 
          right: '0.75rem', 
          top: '0.75rem', 
          zIndex: 5,
          backgroundColor: '#EE5806',
          borderRadius: '999px',
          padding: '0.4rem',
          width: 'auto',
          height: 'auto',
          boxShadow: '0 4px 10px rgba(238, 88, 6, 0.25)'
        }}
        >
          <div onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(cartItem.quantity - 1);
          }} style={{ 
            cursor: 'pointer', 
            padding: '0 8px', 
            color: 'white',
            fontWeight: 'bold'
          }}>-</div>
          <QuantityDisplay>{cartItem.quantity} шт.</QuantityDisplay>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (cartItem.quantity < product.countInStock) {
                handleQuantityChange(cartItem.quantity + 1);
              }
            }}
            style={{ 
              cursor: cartItem.quantity >= product.countInStock ? 'not-allowed' : 'pointer',
              padding: '0 8px',
              color: 'white',
              fontWeight: 'bold',
              opacity: cartItem.quantity >= product.countInStock ? 0.5 : 1
            }}
          >
            +
          </div>
        </QuantitySelector>
      ) : (
        <BuyButton 
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          {product.countInStock > 0 ? 'В корзину' : 'Нет в наличии'}
        </BuyButton>
      )}
    </Card>
  );
};

export default ProductCard; 