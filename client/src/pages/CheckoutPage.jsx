import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectTotalPrice, clearCart } from "../store/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { orderAPI } from "../api";
import toast from "react-hot-toast";

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: 95%;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  width: 100%;
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

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  border: 3px solid #131C3F;
  background-color: transparent;
  color: #131C3F;
  width: 100%;
  margin-bottom: 0.75rem;

  &::placeholder {
    color: #131C3F;
    opacity: 0.7;
    text-transform: uppercase;
  }
`;

const PaymentSection = styled.div`
  margin-top: 1.5rem;
`;

const PaymentTitle = styled.h3`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  color: #EE5806;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RadioInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #131C3F;
  border-radius: 50%;
  margin: 0;
  position: relative;
  
  &:checked {
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      background-color: #131C3F;
      border-radius: 50%;
    }
  }
`;

const RadioLabel = styled.label`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
`;

const TotalPrice = styled.p`
  font-family: 'WADIK', sans-serif;
  font-size: 1.25rem;
  color: #131C3F;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SubmitButton = styled.button`
  font-family: 'WADIK', sans-serif;
  font-size: 1rem;
  padding: 1rem 3rem;
  border-radius: 999px;
  border: none;
  background-color: #EE5806;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  align-self: flex-end;
  margin-top: 1rem;
  
  &:hover {
    background-color: #ff6a1a;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(238, 88, 6, 0.3);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    align-self: center;
    width: 100%;
  }
`;

const CartItemsContainer = styled.div`
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
  border: 3px solid #131C3F;
  border-radius: 15px;
  padding: 1.5rem;
  background-color: white;

  @media (max-width: 1024px) {
    margin-top: 2rem;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #E3B92B;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  gap: 1rem;
  box-shadow: 0px 4px 38px -19px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  background-color: #EE5806;
`;

const CartItemInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CartItemName = styled.p`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const CartItemQuantity = styled.p`
  font-family: 'WADIK', sans-serif;
  color: #EE5806;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: rgba(238, 88, 6, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
`;

// const CartItemBottomRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

const CartItemPrice = styled.p`
  font-family: 'WADIK', sans-serif;
  color: #131C3F;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: right;
  text-transform: uppercase;
`;

const CheckoutPage = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Картой онлайн");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item.product,
    }));

    const order = {
      orderItems,
      shippingAddress: {
        address: formData.address,
        city: "Не указан",
        postalCode: "Не указан",
        country: "Россия",
      },
      paymentMethod,
      totalPrice,
      user: user ? user._id : null,
    };

    try {
      await orderAPI.createOrder(order);
      setLoading(false);
      dispatch(clearCart());
      toast.success("Заказ успешно оформлен!");
      navigate("/order-success");
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "Ошибка при оформлении заказа");
    }
  };

  return (
    <PageWrapper>
      <CheckoutContainer>
        <FormContainer>
          <Title>Оформление заказа</Title>
          <Form onSubmit={handleSubmit}>
            <Input
              name="fullName"
              placeholder="ФИО"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <Input
              name="phone"
              placeholder="Телефон"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <Input
              name="address"
              placeholder="Адрес"
              value={formData.address}
              onChange={handleInputChange}
              required
            />

            <PaymentSection>
              <PaymentTitle>Способ оплаты</PaymentTitle>
              <PaymentOptions>
                <PaymentOption>
                  <RadioInput 
                    type="radio" 
                    id="card-online" 
                    name="payment" 
                    checked={paymentMethod === "Картой онлайн"}
                    onChange={() => setPaymentMethod("Картой онлайн")}
                  />
                  <RadioLabel htmlFor="card-online">Картой онлайн</RadioLabel>
                </PaymentOption>
                <PaymentOption>
                  <RadioInput 
                    type="radio" 
                    id="card-delivery" 
                    name="payment"
                    checked={paymentMethod === "Картой при получении"}
                    onChange={() => setPaymentMethod("Картой при получении")}
                  />
                  <RadioLabel htmlFor="card-delivery">Картой при получении</RadioLabel>
                </PaymentOption>
                <PaymentOption>
                  <RadioInput 
                    type="radio" 
                    id="cash-delivery" 
                    name="payment"
                    checked={paymentMethod === "Наличными при получении"}
                    onChange={() => setPaymentMethod("Наличными при получении")}
                  />
                  <RadioLabel htmlFor="cash-delivery">Наличными при получении</RadioLabel>
                </PaymentOption>
              </PaymentOptions>
            </PaymentSection>

            <Summary>
              <TotalPrice>Цена: {totalPrice} ₽</TotalPrice>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Обработка..." : "Оплатить"}
              </SubmitButton>
            </Summary>
          </Form>
        </FormContainer>
        <CartItemsContainer>
          {cartItems.map((item) => {
            const imageUrl =
              item.image && item.image.startsWith("/uploads")
                ? `${apiUrl}${item.image}`
                : item.image;
            return (
              <CartItem key={item.product}>
                <CartItemImage src={imageUrl || 'https://via.placeholder.com/80x80/f6ebbf/131C3F?text=CAMPLY'} alt={item.name} />
                <CartItemInfo>
                  <CartItemName>{item.name}</CartItemName>
                  <CartItemQuantity>Количество: {item.quantity} шт.</CartItemQuantity>
                  <CartItemPrice>Цена: {item.price} ₽</CartItemPrice>
                </CartItemInfo>
              </CartItem>
            );
          })}
        </CartItemsContainer>
      </CheckoutContainer>
    </PageWrapper>
  );
};

export default CheckoutPage;
