import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaBox, FaShoppingCart, FaChartBar } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const DashboardContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    width: 90%;
  }
`;

const DashboardTitle = styled.h1`
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

const AdminNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#131C3F' : '#fff'};
  color: ${props => props.active ? '#fff' : '#131C3F'};
  border: 2px solid #131C3F;
  border-radius: 999px;
  font-family: 'WADIK', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#131C3F' : 'rgba(19, 28, 63, 0.1)'};
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background-color: ${props => {
    if (props.edit) return '#4CAF50';
    if (props.delete) return '#f44336';
    return '#EE5806';
  }};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #131C3F;
  color: white;
  font-family: 'WADIK', sans-serif;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #EE5806;
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #EE5806;
  color: white;
  border: none;
  border-radius: 999px;
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #ff6a1a;
  }
`;

const OrderStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: ${props => {
    if (props.status === 'Доставлен') return '#4CAF50';
    if (props.status === 'В пути') return '#2196F3';
    if (props.status === 'Обработка') return '#FF9800';
    return '#9E9E9E';
  }};
  color: white;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #131C3F;
  margin: 0.5rem 0;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #EE5806;
  margin-bottom: 0.5rem;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Проверка на админа
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Загрузка данных в зависимости от активной вкладки
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        if (activeTab === 'products' || activeTab === 'stats') {
          const { data: productsData } = await axios.get('/api/products', config);
          setProducts(productsData);
        }
        
        if (activeTab === 'orders' || activeTab === 'stats') {
          const { data: ordersData } = await axios.get('/api/orders', config);
          setOrders(ordersData);
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  // Обработчик удаления товара
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        await axios.delete(`/api/products/${id}`, config);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('Ошибка при удалении товара');
        console.error(err);
      }
    }
  };
  
  // Статистика для вкладки статистики
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order?.totalPrice || 0, 0),
  };
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return (
    <PageWrapper>
      <DashboardContainer>
        <DashboardTitle>Панель администратора</DashboardTitle>
        
        <AdminNav>
          <NavButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
          >
            <FaBox /> Товары
          </NavButton>
          <NavButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingCart /> Заказы
          </NavButton>
          <NavButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
          >
            <FaChartBar /> Статистика
          </NavButton>
        </AdminNav>
        
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            {activeTab === 'products' && (
              <>
                <AddButton to="/admin/products/new">
                  <FaPlus /> Добавить товар
                </AddButton>
                <Table>
                  <thead>
                    <tr>
                      <Th>Изображение</Th>
                      <Th>Название</Th>
                      <Th>Цена</Th>
                      <Th>Категория</Th>
                      <Th>В наличии</Th>
                      <Th>Действия</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <Td>
                          <ProductImage 
                            src={
                              !product.image ? 'https://via.placeholder.com/80x80/f6ebbf/131C3F?text=CAMPLY' :
                              product.image.startsWith('/uploads/') ? `${apiUrl}${product.image}` :
                              product.image.startsWith('/') ? `${apiUrl}${product.image}` :
                              product.image
                            } 
                            alt={product.name} 
                          />
                        </Td>
                        <Td>{product.name}</Td>
                        <Td>{product.price} ₽</Td>
                        <Td>{product.category}</Td>
                        <Td>{product.countInStock}</Td>
                        <Td>
                          <ActionButtonsContainer>
                            <ActionButton 
                              as={Link} 
                              to={`/admin/products/${product._id}/edit`}
                              edit
                            >
                              <FaEdit />
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleDeleteProduct(product._id)}
                              delete
                            >
                              <FaTrash />
                            </ActionButton>
                          </ActionButtonsContainer>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
            
            {activeTab === 'orders' && (
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Дата</Th>
                    <Th>Клиент</Th>
                    <Th>Сумма</Th>
                    <Th>Статус</Th>
                    <Th>Действия</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <Td>{order._id.substring(0, 8)}...</Td>
                      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                      <Td>{order.user ? order.user.name : 'Гость'}</Td>
                      <Td>{order.totalPrice} ₽</Td>
                      <Td>
                        <OrderStatus status={order.status || 'Обработка'}>
                          {order.status || 'Обработка'}
                        </OrderStatus>
                      </Td>
                      <Td>
                        <ActionButtonsContainer>
                          <ActionButton 
                            as={Link} 
                            to={`/admin/orders/${order._id}`}
                            edit
                          >
                            <FaEdit />
                          </ActionButton>
                        </ActionButtonsContainer>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            
            {activeTab === 'stats' && (
              <>
                <StatGrid>
                  <StatCard>
                    <StatIcon><FaBox /></StatIcon>
                    <StatValue>{stats.totalProducts}</StatValue>
                    <StatLabel>Товаров в каталоге</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatIcon><FaShoppingCart /></StatIcon>
                    <StatValue>{stats.totalOrders}</StatValue>
                    <StatLabel>Всего заказов</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatIcon><FaChartBar /></StatIcon>
                    <StatValue>{stats.totalRevenue} ₽</StatValue>
                    <StatLabel>Общая выручка</StatLabel>
                  </StatCard>
                </StatGrid>
              </>
            )}
          </>
        )}
      </DashboardContainer>
    </PageWrapper>
  );
};

export default AdminDashboard;
