import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

const Title = styled.h1`
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
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #131C3F;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(19, 28, 63, 0.1);
  }
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const OrderId = styled.div`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 1.2rem;
  font-weight: 600;
`;

const OrderDate = styled.div`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  opacity: 0.7;
`;

const OrderSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100px;
    height: 3px;
    background-color: #EE5806;
    border-radius: 999px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const InfoLabel = styled.div`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-family: 'WADIK', sans-serif;
  }
  
  th {
    color: #131C3F;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.9rem;
  }
  
  td {
    color: #131C3F;
  }
  
  @media (max-width: 768px) {
    display: block;
    
    thead, tbody, th, td, tr {
      display: block;
    }
    
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    tr {
      margin-bottom: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    
    td {
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
    }
    
    td:before {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      font-weight: 600;
    }
    
    td:nth-of-type(1):before { content: "Изображение"; }
    td:nth-of-type(2):before { content: "Название"; }
    td:nth-of-type(3):before { content: "Количество"; }
    td:nth-of-type(4):before { content: "Цена"; }
  }
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  background-color: #E3B91E;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const TotalBox = styled.div`
  background-color: #131C3F;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-family: 'WADIK', sans-serif;
  
  &:last-child {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const StatusSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatusCard = styled.div`
  flex: 1;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusText = styled.div`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#EE5806'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: 'WADIK', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #ff6a1a;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(238, 88, 6, 0.3);
  }
`;

const OrderEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Не удалось загрузить данные заказа');
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  const markAsPaidHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/orders/${id}/pay`, {}, config);
      toast.success('Статус оплаты обновлен');
      
      // Обновляем данные заказа
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
    } catch (error) {
      toast.error('Не удалось обновить статус оплаты');
    }
  };
  
  const markAsDeliveredHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      toast.success('Статус доставки обновлен');
      
      // Обновляем данные заказа
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
    } catch (error) {
      toast.error('Не удалось обновить статус доставки');
    }
  };
  
  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <Title>Загрузка...</Title>
        </Container>
      </PageWrapper>
    );
  }
  
  if (error) {
    return (
      <PageWrapper>
        <Container>
          <BackButton onClick={() => navigate('/admin/products')}>
            <FaArrowLeft /> Вернуться к списку заказов
          </BackButton>
          <Title>Ошибка</Title>
          <p>{error}</p>
        </Container>
      </PageWrapper>
    );
  }
  
  if (!order) {
    return (
      <PageWrapper>
        <Container>
          <BackButton onClick={() => navigate('/admin/products')}>
            <FaArrowLeft /> Вернуться к списку заказов
          </BackButton>
          <Title>Заказ не найден</Title>
        </Container>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper>
      <Container>
        <BackButton onClick={() => navigate('/admin/products')}>
          <FaArrowLeft /> Вернуться к списку заказов
        </BackButton>
        <Title>Информация о заказе</Title>
        
        <OrderCard>
          <OrderHeader>
            <OrderId>Заказ #{order._id}</OrderId>
            <OrderDate>от {new Date(order.createdAt).toLocaleDateString()}</OrderDate>
          </OrderHeader>
          
          <OrderSection>
            <SectionTitle>Информация о клиенте</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Имя</InfoLabel>
                <InfoValue>{order.user?.name || 'Нет данных'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{order.user?.email || 'Нет данных'}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </OrderSection>
          
          <OrderSection>
            <SectionTitle>Адрес доставки</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Адрес</InfoLabel>
                <InfoValue>{order.shippingAddress?.address || 'Нет данных'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Город</InfoLabel>
                <InfoValue>{order.shippingAddress?.city || 'Нет данных'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Индекс</InfoLabel>
                <InfoValue>{order.shippingAddress?.postalCode || 'Нет данных'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Страна</InfoLabel>
                <InfoValue>{order.shippingAddress?.country || 'Нет данных'}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </OrderSection>
          
          <OrderSection>
            <SectionTitle>Способ оплаты</SectionTitle>
            <InfoItem>
              <InfoValue>{order.paymentMethod}</InfoValue>
            </InfoItem>
          </OrderSection>
          
          <OrderSection>
            <SectionTitle>Товары</SectionTitle>
            <ItemsTable>
              <thead>
                <tr>
                  <th></th>
                  <th>Название</th>
                  <th>Количество</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => {
                  const imageUrl = item.image && item.image.startsWith('/uploads')
                    ? `${apiUrl}${item.image}`
                    : item.image;
                    
                  return (
                    <tr key={index}>
                      <td>
                        <ItemImage 
                          src={imageUrl || 'https://via.placeholder.com/50x50/f6ebbf/131C3F?text=CAMPLY'} 
                          alt={item.name} 
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price} ₽</td>
                    </tr>
                  );
                })}
              </tbody>
            </ItemsTable>
            
            <TotalSection>
              <TotalBox>
                <TotalRow>
                  <span>Товары:</span>
                  <span>{order.itemsPrice || order.totalPrice} ₽</span>
                </TotalRow>
                <TotalRow>
                  <span>Доставка:</span>
                  <span>{order.shippingPrice || 0} ₽</span>
                </TotalRow>
                <TotalRow>
                  <span>Налог:</span>
                  <span>{order.taxPrice || 0} ₽</span>
                </TotalRow>
                <TotalRow>
                  <span>Итого:</span>
                  <span>{order.totalPrice} ₽</span>
                </TotalRow>
              </TotalBox>
            </TotalSection>
          </OrderSection>
          
          <StatusSection>
            <StatusCard>
              <StatusText>
                Статус оплаты: {order.isPaid ? 'Оплачен' : 'Не оплачен'}
                {order.isPaid && (
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
                    {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                )}
              </StatusText>
              {order.isPaid ? (
                <FaCheckCircle color="green" size={24} />
              ) : (
                <ActionButton onClick={markAsPaidHandler}>
                  Отметить как оплаченный
                </ActionButton>
              )}
            </StatusCard>
            
            <StatusCard>
              <StatusText>
                Статус доставки: {order.isDelivered ? 'Доставлен' : 'Не доставлен'}
                {order.isDelivered && (
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </div>
                )}
              </StatusText>
              {order.isDelivered ? (
                <FaCheckCircle color="green" size={24} />
              ) : (
                <ActionButton onClick={markAsDeliveredHandler}>
                  Отметить как доставленный
                </ActionButton>
              )}
            </StatusCard>
          </StatusSection>
        </OrderCard>
      </Container>
    </PageWrapper>
  );
};

export default OrderEditPage;
