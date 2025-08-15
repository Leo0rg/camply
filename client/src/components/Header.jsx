import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaUser, FaBars, FaCog, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/cartSlice';

const HeaderContainer = styled.header`
  background: transparent;
  color: #fff;
  // padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 1rem 0;
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  font-family: 'WADIK', sans-serif;
  font-size: 2.5rem;
  color: #EE5806;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
`;

const SearchContainer = styled.div`
  position: relative;
  width: 30%;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 0.8rem 1.5rem 0.8rem 1.5rem;
  border-radius: 25px;
  border: 3px solid #131C3F;
  background-color: transparent;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  padding-right: 3rem; 
  transition: font-size 0.2s, padding 0.2s, border 0.2s, opacity 0.2s, visibility 0.2s, width 0.2s;

  @media (max-width: 600px) {
    width: 0;
    min-width: 0;
    padding: 0;
    border: none;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    position: absolute;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 1.5rem;
  color: #131C3F;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ menuOpen }) => (menuOpen ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 1rem;
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  margin-left: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  
  &:hover {
    color: #da3434ff;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
  }
`;

const CartBadge = styled.span`
  background-color: #f8f9fa;
  color: #131C3F;
  border-radius: 50%;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.3rem;
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: black;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const cartItems = useSelector(selectCartItems);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">CAMPLY</Logo>
        <SearchContainer>
          <SearchInput placeholder="ПОИСК" />
          <SearchIcon />
        </SearchContainer>
        <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </Hamburger>
        <NavLinks menuOpen={menuOpen}>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart style={{ marginRight: '0.5rem' }} />
            {cartItemsCount > 0 && <CartBadge>{cartItemsCount}</CartBadge>}
          </NavLink>
          <NavLink to="/catalog" onClick={() => setMenuOpen(false)}>
            Каталог
          </NavLink>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)}>
            Блог
          </NavLink>
          
          {user && user.role === 'admin' && (
            <NavLink to="/admin/products" onClick={() => setMenuOpen(false)}>
              <FaCog style={{ marginRight: '0.5rem' }} />
              Админ-панель
            </NavLink>
          )}
          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                <FaUser style={{ marginRight: '0.5rem' }} />
                Профиль
              </NavLink>
              <NavLink to="/" onClick={() => { logout(); setMenuOpen(false); }}>
                Выйти
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)}>
              ВХОД/АВТОРИЗАЦИЯ
            </NavLink>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;