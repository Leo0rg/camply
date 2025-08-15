import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { productAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '../store/cartSlice';
import { Helmet } from 'react-helmet-async';

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const Page = styled.div`
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    width: 90%;
    grid-template-columns: 1fr;
  }
`;

const ImageWrap = styled.div`
  background: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-shadow: 0px 4px 38px -19px rgba(0,0,0,0.25);
  height: 400px;
  overflow: hidden;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h1`
  font-family: 'WADIK', sans-serif;
  font-size: 2.5rem;
  color: #131C3F;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
`;

const Price = styled.div`
  font-family: 'WADIK', sans-serif;
  font-size: 1.8rem;
  color: #EE5806;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #131C3F;
  line-height: 1.6;
  font-size: 1.1rem;
  margin: 1.5rem 0;
`;

const Stars = styled.div`
  display: inline-flex;
  gap: 2px;
`;

const AddButton = styled.button`
  align-self: flex-start;
  background-color: #ee5806;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 2rem;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
  box-shadow: 0 10px 24px rgba(238,88,6,.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(238,88,6,.45);
  }
`;

const Reviews = styled.div`
  grid-column: 1 / -1;
  margin-top: 3rem;
`;

const ReviewsTitle = styled.h2`
  font-family: 'WADIK', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #131C3F;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100px;
    height: 3px;
    background-color: #EE5806;
  }
`;

const ReviewPlaceholder = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 4px 38px -19px rgba(0,0,0,0.25);
  color: #131C3F;
  margin-bottom: 1rem;
`;

const ReviewForm = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0px 4px 38px -19px rgba(0,0,0,0.25);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border-radius: 12px;
  border: 3px solid #131C3F;
  font-family: 'WADIK', sans-serif;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
  }
`;

const Select = styled.select`
  width: 200px;
  padding: 0.75rem;
  border-radius: 12px;
  border: 3px solid #131C3F;
  font-family: 'WADIK', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
  }
`;

const SubmitReview = styled.button`
  align-self: flex-end;
  background: #EE5806;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.5rem;
  font-family: 'WADIK', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ff6a1a;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(238, 88, 6, 0.3);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const load = async () => {
      try {
        const data = await productAPI.getProductById(id);
        setProduct(data);
      } catch (e) {
        setError(e.message || 'Ошибка загрузки товара');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <PageWrapper><Page>Загрузка...</Page></PageWrapper>;
  if (error) return <PageWrapper><Page>{error}</Page></PageWrapper>;
  if (!product) return null;

  // Определяем URL изображения
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // Обрабатываем различные варианты путей к изображениям
  let imageUrl;
  if (!product.image) {
    // Если изображения нет, используем плейсхолдер
    imageUrl = 'https://via.placeholder.com/400x400/f6ebbf/131C3F?text=CAMPLY';
  } else if (product.image.startsWith('/uploads/')) {
    // Если путь начинается с /uploads/, это относительный путь к файлу
    // Для React-приложения в режиме разработки нужно добавить полный URL сервера
    imageUrl = `${apiUrl}${product.image}`;
  } else if (product.image.startsWith('/')) {
    // Если начинается с /, но не с /uploads/, это путь относительно API
    imageUrl = `${apiUrl}${product.image}`;
  } else {
    // Иначе это полный URL или другой формат пути
    imageUrl = product.image;
  }
  
  console.log('ProductPage: image path =', product.image, 'resolved to =', imageUrl);

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const star = '★';
    const halfStar = '☆';
    return (
      <Stars aria-label={`Рейтинг ${rating} из 5`}>
        {Array.from({ length: full }).map((_, i) => (
          <span key={`pf${i}`} style={{ color: '#FFC107', fontSize: '1rem' }}>{star}</span>
        ))}
        {half === 1 && <span style={{ color: '#FFC107', fontSize: '1rem' }}>{halfStar}</span>}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`pe${i}`} style={{ color: '#DDD', fontSize: '1rem' }}>{star}</span>
        ))}
      </Stars>
    );
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>{`${product.name} - CAMPLY`}</title>
        <meta name="description" content={`${product.description.substring(0, 160)}...`} />
        <link rel="canonical" href={`/product/${product._id}`} />
        <meta name="keywords" content={`${product.name}, туризм, кемпинг, товары для пикника`} />
        <meta property="og:title" content={`${product.name} - CAMPLY`} />
        <meta property="og:description" content={`${product.description.substring(0, 160)}...`} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:price:amount" content={product.price} />
        <meta property="og:price:currency" content="RUB" />
        <meta property="og:availability" content={product.countInStock > 0 ? "in stock" : "out of stock"} />
      </Helmet>
      <Page>
        <ImageWrap>
          <Image src={imageUrl} alt={product.name} loading="lazy" />
        </ImageWrap>
        <Info>
          <Title>{product.name}</Title>
          <Price>{product.price} ₽</Price>
          {renderStars(product.rating)}
          <Description>{product.description}</Description>
          <AddButton onClick={() => dispatch(addToCartAction({ product, quantity: 1 }))}>Добавить в корзину</AddButton>
        </Info>

        <Reviews>
          <ReviewsTitle>Отзывы пользователей</ReviewsTitle>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r) => (
              <ReviewPlaceholder key={r._id}>
                <strong>{r.name}</strong> — {renderStars(r.rating)}
                <div style={{ marginTop: '0.5rem' }}>{r.comment}</div>
              </ReviewPlaceholder>
            ))
          ) : (
            <ReviewPlaceholder>Пока нет отзывов</ReviewPlaceholder>
          )}

        {user && (
          <ReviewForm
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setReviewError(null);
              try {
                await productAPI.addReview(id, { rating, comment });
                const updated = await productAPI.getProductById(id);
                setProduct(updated);
                setComment('');
                setRating(5);
              } catch (err) {
                setReviewError(err.message || 'Ошибка при добавлении отзыва');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>5 — Отлично</option>
              <option value={4}>4 — Хорошо</option>
              <option value={3}>3 — Нормально</option>
              <option value={2}>2 — Плохо</option>
              <option value={1}>1 — Очень плохо</option>
            </Select>
            <TextArea
              placeholder="Ваш отзыв"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            {reviewError && <div style={{ color: 'crimson' }}>{reviewError}</div>}
            <SubmitReview type="submit" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Оставить отзыв'}
            </SubmitReview>
          </ReviewForm>
        )}
        </Reviews>
      </Page>
    </PageWrapper>
  );
};

export default ProductPage;


