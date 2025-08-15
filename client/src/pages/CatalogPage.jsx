import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { productAPI } from '../api';
import { CATEGORIES } from '../constants/categories';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity, selectCartItems } from '../store/cartSlice';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const PageContainer = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
  
  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    width: 90%;
  }
`;

const Sidebar = styled.div`
  padding: 1rem 0;
`;

const MainContent = styled.div`
  padding: 1rem 0;
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const CatalogTitle = styled.h1`
  font-family: 'WADIK', sans-serif;
  font-size: 2.8rem;
  color: #EE5806;
  margin: 0;
  padding-bottom: 0.5rem;
`;

const Divider = styled.div`
  height: 5px;
  width: 100%;
  background: #EE5806;
`;

const BlockTitle = styled.h2`
  font-family: 'WADIK', sans-serif;
  font-size: 1.5rem;
  color: #EE5806;
  margin: 1.5rem 0 1rem;
`;

const RangeRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 3px solid #131C3F;
  border-radius: 999px;
  font-family: 'WADIK', sans-serif;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
  }
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? '#131C3F' : '#8CC152'};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  text-align: right;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  height: 200px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#131C3F' : '#EE5806'};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => props.categoryKey ? `url('/category-images/${props.categoryKey}.png')` : 'none'};
    background-size: cover;
    background-position: center;
    opacity: 0.7;
    z-index: 0;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Search = styled.input`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: 3px solid #131C3F;
  border-radius: 999px;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  color: #131C3F;
  background-color: transparent;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
  }
  
  &::placeholder {
    color: rgba(19, 28, 63, 0.5);
  }
`;

const SortContainer = styled.div`
  position: relative;
  min-width: 200px;
  
  &:after {
    content: '▼';
    font-size: 0.8rem;
    color: #131C3F;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

const SortDropdown = styled.select`
  width: 100%;
  padding: 0.75rem 1.25rem;
  border: 3px solid #131C3F;
  border-radius: 999px;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  color: #131C3F;
  background-color: transparent;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
  }
`;

const ResetButton = styled.button`
  background-color: #EE5806;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-family: 'WADIK', sans-serif;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #d44e00;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 300px);
  gap: 1.25rem;
  justify-content: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 300px);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(1, 300px);
  }
`;

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popularity');
  const [range, setRange] = useState({ from: 0, to: 100000 });
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const min = 0;
  const max = 100000;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [location]);

  const handleReset = () => {
    setSearch('');
    setSort('popularity');
    setRange({ from: min, to: max });
    setCategory('');
  };

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const star = '★';
    const halfStar = '☆';
    return (
      <Stars>
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f${i}`} style={{ color: '#FFB800' }}>{star}</span>
        ))}
        {half === 1 && <span style={{ color: '#FFB800' }}>{halfStar}</span>}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e${i}`} style={{ color: '#DDD' }}>{star}</span>
        ))}
      </Stars>
    );
  };

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.price >= range.from && p.price <= range.to)
    .filter(p => category ? p.category === category : true)
    .sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';


  const categoryTitle = category ? 
    CATEGORIES.find(c => c.key === category)?.name || 'Каталог товаров' : 
    'Каталог товаров';
    

  const pageDescription = category ? 
    `Товары в категории ${categoryTitle}. Цены от ${range.from} до ${range.to} рублей.` :
    `Полный каталог товаров для туризма и пикника. Цены от ${range.from} до ${range.to} рублей.`;

  return (
    <PageContainer>
      <Helmet>
        <title>{`${categoryTitle} - CAMPLY`}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`/catalog${category ? `?category=${category}` : ''}`} />
        <meta name="keywords" content={`${categoryTitle}, туризм, кемпинг, товары для пикника, каталог`} />
      </Helmet>
      <Container>
        <Sidebar>
          <BlockTitle>Цена</BlockTitle>

          <RangeRow>
            <div style={{ display: 'grid' }}>
              <span style={{ fontFamily: 'WADIK, sans-serif', fontSize: '0.7rem', color: '#131C3F', marginBottom: 4 }}>ОТ</span>
              <NumberInput type="number" value={range.from} min={min} max={range.to} onChange={(e)=>setRange(r=>({...r, from: Number(e.target.value)}))}/>
            </div>
            <div style={{ display: 'grid' }}>
              <span style={{ fontFamily: 'WADIK, sans-serif', fontSize: '0.7rem', color: '#131C3F', marginBottom: 4 }}>ДО</span>
              <NumberInput type="number" value={range.to} min={range.from} max={max} onChange={(e)=>setRange(r=>({...r, to: Number(e.target.value)}))}/>
            </div>
          </RangeRow>

          <BlockTitle>Категории</BlockTitle>
          <CategoryButtons>
            <CategoryButton 
              active={category === ''}
              onClick={() => setCategory('')}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Все категории</span>
            </CategoryButton>
            {CATEGORIES.map(c => (
              <CategoryButton
                key={c.key}
                active={category === c.key}
                onClick={() => setCategory(c.key)}
                categoryKey={c.key}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>{c.label}</span>
              </CategoryButton>
            ))}
          </CategoryButtons>

          <ResetButton onClick={handleReset}>
            Сбросить фильтры
          </ResetButton>
        </Sidebar>

        <MainContent>
          <SectionHeader>
            <CatalogTitle>Каталог товаров</CatalogTitle>
            <Divider />
          </SectionHeader>

          <Controls>
            <Search placeholder="Поиск" value={search} onChange={(e)=>setSearch(e.target.value)} />
            <SortContainer>
              <SortDropdown value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value="popularity">По популярности</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="name-asc">По названию (А-Я)</option>
                <option value="name-desc">По названию (Я-А)</option>
                <option value="rating">По рейтингу</option>
              </SortDropdown>
            </SortContainer>
          </Controls>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>Загрузка...</div>
          ) : error ? (
            <div style={{ color: '#721c24', background: '#f8d7da', padding: '1rem', borderRadius: '0.5rem' }}>
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              Товары не найдены
            </div>
          ) : (
            <Grid>
              {filtered.map(product => {
                const cartItem = cartItems.find(item => item.product === product._id);
                const isAdded = !!cartItem;
                
                const handleAddToCart = () => {
                  dispatch(addToCart({ product, quantity: 1 }));
                  toast.success(`${product.name} добавлен в корзину!`);
                };
                
                const handleUpdateQuantity = (productId, quantity) => {
                  dispatch(updateQuantity({ productId, quantity }));
                };
                
                return (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    isAdded={isAdded}
                    cartItem={cartItem}
                    updateQuantity={handleUpdateQuantity}
                  />
                );
              })}
            </Grid>
          )}
        </MainContent>
      </Container>
    </PageContainer>
  );
};

// Определяем пустой компонент Stars для совместимости с кодом выше
const Stars = styled.div`
  display: inline-flex;
  gap: 4px;
  margin-top: 8px;
  font-size: 1.2rem;
  line-height: 1;
`;

export default CatalogPage;