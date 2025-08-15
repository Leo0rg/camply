import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FooterContainer = styled.footer`
  background: #E3B91E;
  padding: 2rem 0 1rem;
  width: 100%;
`;

const FooterContent = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  font-family: 'WADIK', sans-serif;
  font-size: 2.5rem;
  color: #131C3F;
  font-weight: bold;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    font-size: 2rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    width: 100%;
    justify-content: space-around;
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.h4`
  color: #131C3F;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'WADIK', sans-serif;
`;

const FooterLink = styled(Link)`
  color: #131C3F;
  text-decoration: none;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: 'WADIK', sans-serif;

  &:hover {
    color: #EE5806;
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: #131C3F;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(19, 28, 63, 0.2);
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.8rem;
  font-family: 'WADIK', sans-serif;
`;

const Footer = () => {
  const { user } = useContext(AuthContext);

  return (
    <FooterContainer>
      <FooterContent>
        <Logo to="/">CAMPLY</Logo>
        <LinksContainer>
          <LinkColumn>
            <ColumnTitle>Магазин</ColumnTitle>
            <FooterLink to="/">Главная</FooterLink>
            {/* <FooterLink to="/products">Товары</FooterLink> */}
            <FooterLink to="/cart">Корзина</FooterLink>
          </LinkColumn>
          <LinkColumn>
            <ColumnTitle>Аккаунт</ColumnTitle>
            {user ? (
              <FooterLink to="/profile">Профиль</FooterLink>
            ) : (
              <>
                <FooterLink to="/login">Войти</FooterLink>
                <FooterLink to="/register">Регистрация</FooterLink>
              </>
            )}
          </LinkColumn>
        </LinksContainer>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 