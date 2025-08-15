import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa';
import { CATEGORIES } from '../../constants/categories';

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  max-width: 800px;
`;

const PageTitle = styled.h1`
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
    height: 2px;
    background-color: #131C3F;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 0.75rem 1.25rem;
  border: 3px solid #131C3F;
  border-radius: 999px;
  font-size: 1rem;
  background-color: transparent;
  color: #131C3F;
  font-family: 'WADIK', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
    box-shadow: 0 0 0 0.2rem rgba(238, 88, 6, 0.25);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1.25rem;
  border: 3px solid #131C3F;
  border-radius: 999px;
  font-size: 1rem;
  background-color: transparent;
  color: #131C3F;
  font-family: 'WADIK', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
    box-shadow: 0 0 0 0.2rem rgba(238, 88, 6, 0.25);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1.25rem;
  border: 3px solid #131C3F;
  border-radius: 20px;
  font-size: 1rem;
  background-color: transparent;
  color: #131C3F;
  font-family: 'WADIK', sans-serif;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #EE5806;
    box-shadow: 0 0 0 0.2rem rgba(238, 88, 6, 0.25);
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  margin-top: 0.5rem;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #131C3F;
  color: white;
  border-radius: 999px;
  font-family: 'WADIK', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #1f2b5f;
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const UploadStatus = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.error ? '#f44336' : '#4CAF50'};
`;

const Button = styled.button`
  padding: 0.9rem 2rem;
  background-color: #EE5806;
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'WADIK', sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  align-self: flex-end;
  
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

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setImage(data.image);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
        } catch (error) {
          toast.error('Не удалось загрузить данные товара');
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const [uploadError, setUploadError] = useState(null);
  
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post('/api/products/upload', formData, config);
      setImage(data);
      console.log('Загруженное изображение, путь:', data);
      setUploading(false);
      toast.success('Изображение успешно загружено');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadError('Ошибка загрузки изображения. Проверьте формат и размер файла.');
      toast.error('Ошибка загрузки изображения');
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const productData = { name, price, image, category, countInStock, description };

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await axios.put(`/api/products/${id}`, productData, config);
        toast.success('Товар успешно обновлен');
      } else {
        await axios.post('/api/products', productData, config);
        toast.success('Товар успешно создан');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error('Ошибка сохранения товара');
    }
  };

  return (
    <PageWrapper>
      <Container>
        <PageTitle>{isEditing ? 'Редактировать товар' : 'Добавить товар'}</PageTitle>
        <Form onSubmit={submitHandler}>
          <FormGroup>
            <Label>Название</Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Цена</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Изображение</Label>
            <Input 
              type="text" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              placeholder="URL изображения появится здесь после загрузки" 
              disabled={uploading}
            />
            <FileInputWrapper>
              <FileInputLabel htmlFor="image-file">
                <FaUpload /> Загрузить изображение
              </FileInputLabel>
              <HiddenFileInput
                id="image-file"
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
              />
              {uploading && <UploadStatus>Загрузка...</UploadStatus>}
              {uploadError && <UploadStatus error>{uploadError}</UploadStatus>}
              {image && !uploading && !uploadError && (
                <UploadStatus>Изображение успешно загружено</UploadStatus>
              )}
            </FileInputWrapper>
          </FormGroup>
          <FormGroup>
            <Label>Категория</Label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Выберите категорию</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Количество на складе</Label>
            <Input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Описание</Label>
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </FormGroup>
          <Button type="submit" disabled={uploading}>
            {isEditing ? 'Обновить' : 'Создать'}
          </Button>
        </Form>
      </Container>
    </PageWrapper>
  );
};

export default ProductEditPage; 