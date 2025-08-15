import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../blog/posts';

const PageWrapper = styled.div`
  width: 100%;
  background-color: #F6EBBF;
  min-height: calc(100vh - 100px);
  padding: 2rem 0;
`;

const Page = styled.div`
  width: 80%;
  margin: 0 auto;
  @media (max-width: 768px) { width: 90%; }
`;

const Hero = styled.div`
  height: 400px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(19, 28, 63, 0.1), rgba(19, 28, 63, 0.6));
  }
`;

const Title = styled.h1`
  font-family: 'WADIK', sans-serif;
  font-size: 2.5rem;
  color: #131C3F;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100px;
    height: 5px;
    background-color: #EE5806;
    border-radius: 999px;
  }
`;

const Content = styled.div`
  line-height: 1.8;
  font-family: 'WADIK', sans-serif;
  font-size: 1.1rem;
  color: #131C3F;
  white-space: pre-line;
  margin-bottom: 3rem;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return (
    <PageWrapper>
      <Page>
        <Title>Статья не найдена</Title>
        <Content>Запрошенная статья не существует или была удалена.</Content>
      </Page>
    </PageWrapper>
  );
  
  return (
    <PageWrapper>
      <Page>
        <Hero style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog${post.slug === 'vybor-palatki-dlya-pohoda' ? '1' : post.slug === 'komfort-v-lagere' ? '2' : '3'}.png)` }} />
        <Title>{post.title}</Title>
        <Content>{post.content}</Content>
      </Page>
    </PageWrapper>
  );
};

export default BlogPostPage;


