import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import bannerBg from '../assets/баннер.svg';
import { FaArrowUp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../api';
import { CATEGORIES } from '../constants/categories';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, selectCartItems } from '../store/cartSlice';
import { Helmet } from 'react-helmet-async';

const BlogGrid = styled.div`
  width: 80%;
  margin: 1rem auto 4rem;
  display: flex;
  gap: 1.5rem;
  height: 400px;
  @media (max-width: 992px) { 
    flex-direction: column;
    width: 90%;
    height: auto;
  }
`;

const BlogCard = styled.a`
  display: block;
  border-radius: 12px;
  height: 100%;
  color: #fff;
  text-decoration: none;
  padding: 1.5rem;
  position: relative;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(238, 88, 6, 0.25);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(19, 28, 63, 0.1), rgba(19, 28, 63, 0.8));
    z-index: 1;
  }
`;

const BlogTitle = styled.h3`
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  margin: 0;
  font-family: 'WADIK', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  z-index: 2;
  max-width: 90%;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const HeroSection = styled.section`
  background-color: #0f1e3a;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 2rem;
  width: 70%;
  max-width: 1548px;
  min-height: 620px;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 992px) {
    min-height: 380px;
  }

  @media (max-width: 768px) {
    width: 90%;
    min-height: 320px;
    padding: 2rem 1rem;
    border-radius: 1.5rem;
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding-left: 38%;

  @media (max-width: 1200px) {
    padding-left: 32%;
  }

  @media (max-width: 992px) {
    padding-left: 24%;
  }

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const HeroRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: 'WADIK', sans-serif;
  font-size: clamp(2.25rem, 4.6vw, 3.75rem);
  line-height: 1.1;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  max-width: 20ch;
`;

const HeroSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  max-width: 32rem;
  margin-bottom: 1.25rem;
  font-family: 'WADIK', sans-serif;
`;

const ShopButton = styled.button`
  background-color: #ee5806;
  color: #ffffff;
  padding: 1.1rem 2.5rem;
  border-radius: 3rem;
  text-decoration: none;
  font-weight: 700;
  font-family: 'WADIK', sans-serif;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: 0 10px 24px rgba(238, 88, 6, 0.35);
  font-size: 1rem;
  margin-top: 5rem;
  cursor: pointer;
  text-transform: uppercase;
  margin-left: auto;
  white-space: nowrap;

  &:hover {
    background-color: #ff6a1a;
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(238, 88, 6, 0.45);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.25rem;
    font-size: 0.95rem;
    padding: 1rem 2rem;
  }
`;

const SectionHeader = styled.div`
  width: 80%;
  margin: 2rem auto 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'WADIK', sans-serif;
  font-size: 2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const SectionDivider = styled.div`
  height: 5px;
  background: #0f1e3a;
  border-radius: 999px;
`;

const CategoriesGrid = styled.div`
  width: 80%;
  margin: 1.5rem auto 3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    width: 90%;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.a`
  background: #8CC152;
  border-radius: 10px;
  height: 200px;
  box-shadow: 0px 4px 38px -19px rgba(0,0,0,0.25);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0.75rem;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 25px -10px rgba(0,0,0,0.3);
    background: #EE5806;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => {
      if (props.categoryKey === 'tents') return `url(${process.env.PUBLIC_URL}/category-images/tents.png)`;
      if (props.categoryKey === 'comfort') return `url(${process.env.PUBLIC_URL}/category-images/comfort.png)`;
      if (props.categoryKey === 'mattresses') return `url(${process.env.PUBLIC_URL}/category-images/mattresses.png)`;
      if (props.categoryKey === 'kitchen') return `url(${process.env.PUBLIC_URL}/category-images/kitchen.png)`;
      if (props.categoryKey === 'bags') return `url(${process.env.PUBLIC_URL}/category-images/bags.png)`;
      if (props.categoryKey === 'other') return `url(${process.env.PUBLIC_URL}/category-images/other.png)`;
      return 'none';
    }};
    background-size: cover;
    background-position: center;
    opacity: 0.7;
    z-index: 0;
  }
`;

const CategoryLabel = styled.div`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  background: #131C3F;
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 300px);
  gap: 2rem;
  margin-top: 1rem;
  padding-bottom: 4rem;
  width: 80%;
  justify-content: center;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 300px);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 300px);
  }

  @media (max-width: 768px) {
    width: 90%;
    gap: 1rem;
    grid-template-columns: repeat(1, 300px);
  }
`;

const Message = styled.div`
  padding: 1rem;
  background-color: ${props => props.error ? '#EE5806' : '#EE5806'};
  color: ${props => props.error ? '#721c24' : 'white'};
  border-radius: 3rem;
  margin: 1rem 0;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  margin: 5rem 0;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid #131C3F;
    border-color: #131C3F transparent #131C3F transparent;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #131C3F;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(19, 28, 63, 0.3);

  &:hover {
    background-color: #EE5806;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(19, 28, 63, 0.4);
  }
`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const recommendedRef = useRef(null);

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleScrollToCatalog = () => {
    recommendedRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [checkScrollTop]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getTopProducts(8);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Ошибка при загрузке товаров');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} добавлен в корзину!`);
  };
  
  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  return (
    <PageContainer>
      <Helmet>
        <title>CAMPLY - Товары для туризма и пикника</title>
        <meta name="description" content="Интернет-магазин товаров для туризма и пикника. Широкий выбор палаток, мебели, матрасов, кухонного оборудования и рюкзаков." />
        <link rel="canonical" href="/" />
        <meta name="keywords" content="туризм, кемпинг, палатки, походное снаряжение, товары для пикника" />
      </Helmet>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Всё для туризма и<br/>пикника</HeroTitle>
          <HeroRow>
            <HeroSubtitle>
              Соберись на природу легко — от рюкзака до уютного отдыха
            </HeroSubtitle>
            <ShopButton onClick={handleScrollToCatalog}>Смотреть товары</ShopButton>
          </HeroRow>
        </HeroContent>
      </HeroSection>
      
      <SectionHeader ref={recommendedRef}>
        <SectionTitle>Рекомендованные товары</SectionTitle>
        <SectionDivider />
      </SectionHeader>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Message error>{error}</Message>
      ) : products.length === 0 ? (
        <Message>Товары не найдены</Message>
      ) : (
        <ProductsGrid>
          {products.slice(0, 8).map((product) => {
            const cartItem = cartItems.find(item => item.product === product._id);
            const isAdded = !!cartItem;
            return (
                              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart}
                isAdded={isAdded}
                cartItem={cartItem}
                updateQuantity={handleUpdateQuantity}
              />
            )
          })}
        </ProductsGrid>
      )}

      <SectionHeader>
        <SectionTitle>Категории</SectionTitle>
        <SectionDivider />
      </SectionHeader>
      <CategoriesGrid>
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.key} href={`/catalog?category=${c.key}`} categoryKey={c.key}>
            <CategoryLabel>{c.label}</CategoryLabel>
          </CategoryCard>
        ))}
      </CategoriesGrid>

      <SectionHeader>
        <SectionTitle>Блог</SectionTitle>
        <SectionDivider />
      </SectionHeader>
      <BlogGrid>
        <BlogCard 
          href="/blog/vybor-palatki-dlya-pohoda" 
          style={{ 
            flex: '2',
            backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog1.png)` 
          }}
        >
          <BlogTitle>Как выбрать палатку для похода</BlogTitle>
        </BlogCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '1', height: '100%' }}>
          <BlogCard 
            href="/blog/komfort-v-lagere" 
            style={{ 
              flex: '1',
              backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog2.png)` 
            }}
          >
            <BlogTitle>Комфорт в лагере: кресла, коврики, матрасы</BlogTitle>
          </BlogCard>
          <BlogCard 
            href="/blog/kukhonnaya-utvar-i-gril" 
            style={{ 
              flex: '1',
              backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog3.png)` 
            }}
          >
            <BlogTitle>Кухонное оборудование и гриль на природе</BlogTitle>
          </BlogCard>
        </div>
      </BlogGrid>
      <ScrollToTopButton onClick={scrollTop} show={showScroll}>
        <FaArrowUp />
      </ScrollToTopButton>
    </PageContainer>
  );
};

export default HomePage; 