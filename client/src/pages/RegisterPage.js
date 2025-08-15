import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const PageContainer = styled.div`
  width: 100%;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
`;

const RegisterContainer = styled.div`
  margin: 2rem auto;
  padding: 2rem 3rem;
  border: 3px solid #131C3F;
  border-radius: 3rem;
  box-shadow: 0 8px 24px rgba(19, 28, 63, 0.15);
  background-color: #fff;
  width: auto;
  min-width: 320px;
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
    width: calc(100% - 2rem);
  }
`;

const RegisterTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #EE5806;
  font-family: 'WADIK', sans-serif;
  font-size: 3.2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 3px solid #131C3F;
  border-radius: 3rem;
  font-size: 1rem;
  color: #131C3F;
  font-family: 'WADIK', sans-serif;
  
  &:focus {
    border-color: #EE5806;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(238, 88, 6, 0.25);
  }
`;

const SubmitButton = styled.button`
  background-color: #EE5806;
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 3rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  font-family: 'WADIK', sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  width: 100%;
  
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

const Message = styled.div`
  padding: 1rem;
  background-color: ${props => props.error ? '#f8d7da' : '#d4edda'};
  color: ${props => props.error ? '#721c24' : '#155724'};
  border-radius: 3rem;
  margin-bottom: 1rem;
  font-family: 'WADIK', sans-serif;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  
  a {
    color: #EE5806;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем redirect из query параметров
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем его
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await register(name, email, password);
      
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
      
    } catch (err) {
      setError('Произошла ошибка при регистрации. Попробуйте позже.');
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <RegisterContainer>
        <RegisterTitle>Регистрация</RegisterTitle>
        
        {error && <Message error>{error}</Message>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Имя</FormLabel>
            <FormInput 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Пароль</FormLabel>
            <FormInput 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Подтверждение пароля</FormLabel>
            <FormInput 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </SubmitButton>
        </Form>
        
        <LoginLink>
          Уже есть аккаунт?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Войти
          </Link>
        </LoginLink>
      </RegisterContainer>
    </PageContainer>
  );
};

export default RegisterPage; 