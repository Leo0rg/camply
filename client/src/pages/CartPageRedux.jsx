import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalPrice, updateQuantity, removeFromCart } from '../store/cartSlice';
import { AuthContext } from '../context/AuthContext';
import { FaArrowUp } from 'react-icons/fa';
import { useContext } from 'react';

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const CartContainer = styled.div`
  width: 70%;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const CartTitle = styled.h1`
  font-family: 'WADIK', sans-serif;
  font-size: 2.5rem;
  color: #EE5806;
  margin-bottom: 2rem;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: #131C3F;
    border-radius: 999px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const CartEmpty = styled.div`
  background-color: #F6EBBF;
  padding: 2rem;
  text-align: center;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  p {
    font-family: 'WADIK', sans-serif;
    font-size: 1.2rem;
    color: #131C3F;
    margin-bottom: 1rem;
  }

  a {
    font-family: 'WADIK', sans-serif;
    color: #EE5806;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #F6EBBF;
  position: relative;
`;

const ItemSeparator = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ddd;
  margin: 0;
  padding: 0;
`;

const CartItemImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 0;
  background-color: #E3B91E;
  overflow: hidden;
  margin-right: 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const CartItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CartItemName = styled.div`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  color: #131C3F;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  font-weight: bold;
`;

const CartItemDescription = styled.div`
  display: none;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const CartItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  color: #131C3F;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    color: #EE5806;
  }
`;

const QuantityDisplay = styled.span`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  color: #131C3F;
  font-weight: bold;
`;

const CartItemPrice = styled.div`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  color: #131C3F;
  font-weight: bold;
  min-width: 60px;
  text-align: right;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.25rem;
  
  &:hover {
    color: #EE5806;
  }
`;

const CartSummary = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const TotalPrice = styled.div`
  font-family: 'WADIK', sans-serif;
  font-size: 1.5rem;
  color: #131C3F;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const CheckoutButton = styled(Link)`
  display: inline-block;
  background-color: #EE5806;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  font-family: 'WADIK', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d44e00;
  }
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #131C3F;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  opacity: ${props => props.visible ? '1' : '0'};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s;
  z-index: 100;
  
  &:hover {
    background-color: #EE5806;
    transform: translateY(-3px);
  }
`;

const CartPage = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
//   const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

//   const handleCheckout = () => {
//     if (!user) {
//       navigate('/login?redirect=checkout');
//     } else {
//       navigate('/checkout');
//     }
//   };

  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <PageWrapper>
      <CartContainer>
        <CartTitle>Корзина</CartTitle>
        
        {cartItems.length === 0 ? (
          <CartEmpty>
            <p>Ваша корзина пуста</p>
            <Link to="/catalog">Перейти в каталог</Link>
          </CartEmpty>
        ) : (
          <>
            {cartItems.map((item, index) => {
              const imageUrl = item.image && item.image.startsWith('/uploads') ? `${apiUrl}${item.image}` : item.image;
              return (
                <React.Fragment key={item.product}>
                  <CartItem>
                    <CartItemImage>
                      <img src={imageUrl || 'https://via.placeholder.com/80x80/f6ebbf/131C3F?text=CAMPLY'} alt={item.name} />
                    </CartItemImage>
                    <CartItemInfo>
                      <CartItemName>{item.name}</CartItemName>
                      <CartItemDescription>{item.description}</CartItemDescription>
                    </CartItemInfo>
                    <CartItemActions>
                      <QuantitySelector>
                        <QuantityButton onClick={() => handleUpdateQuantity(item.product, Math.max(1, item.quantity - 1))}>-</QuantityButton>
                        <QuantityDisplay>{item.quantity}</QuantityDisplay>
                        <QuantityButton onClick={() => handleUpdateQuantity(item.product, Math.min(item.countInStock, item.quantity + 1))}>+</QuantityButton>
                      </QuantitySelector>
                      <CartItemPrice>{(item.price * item.quantity).toFixed(2)} ₽</CartItemPrice>
                      <RemoveButton onClick={() => handleRemoveFromCart(item.product)}>Удалить</RemoveButton>
                    </CartItemActions>
                  </CartItem>
                  {index < cartItems.length - 1 && <ItemSeparator />}
                </React.Fragment>
              );
            })}
            
            <CartSummary>
              <TotalPrice>Итого: {totalPrice.toFixed(2)} ₽</TotalPrice>
              <CheckoutButton to={user ? '/checkout' : '/login?redirect=checkout'}>
                Оформить заказ
              </CheckoutButton>
            </CartSummary>
          </>
        )}
        
        <ScrollToTopButton visible={showScrollButton} onClick={scrollToTop}>
          <FaArrowUp />
        </ScrollToTopButton>
      </CartContainer>
    </PageWrapper>
  );
};

export default CartPage;
