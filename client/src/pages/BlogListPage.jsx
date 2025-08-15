import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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

const SectionHeader = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-family: 'WADIK', sans-serif;
  font-size: 2.5rem;
  color: #EE5806;
  margin: 0;
  text-transform: uppercase;
`;

const Divider = styled.div`
  height: 5px;
  background: #131C3F;
  border-radius: 999px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  @media (max-width: 992px) { grid-template-columns: 1fr; }
`;

const Card = styled(Link)`
  display: block;
  border-radius: 12px;
  height: 220px;
  color: #fff;
  text-decoration: none;
  padding: 1rem;
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

const CardTitle = styled.h2`
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  margin: 0;
  font-family: 'WADIK', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  z-index: 2;
  max-width: 90%;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const BlogListPage = () => {
  return (
    <PageWrapper>
      <Page>
        <SectionHeader>
          <Title>Блог</Title>
          <Divider />
        </SectionHeader>
        <Grid>
          <Card 
            to={`/blog/${BLOG_POSTS[0].slug}`} 
            style={{ 
              height: 300,
              backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog1.png)` 
            }}
          >
            <CardTitle>{BLOG_POSTS[0].title}</CardTitle>
          </Card>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Card 
              to={`/blog/${BLOG_POSTS[1].slug}`}
              style={{ 
                backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog2.png)` 
              }}
            >
              <CardTitle>{BLOG_POSTS[1].title}</CardTitle>
            </Card>
            <Card 
              to={`/blog/${BLOG_POSTS[2].slug}`}
              style={{ 
                backgroundImage: `url(${process.env.PUBLIC_URL}/blog/placeholders/blog3.png)` 
              }}
            >
              <CardTitle>{BLOG_POSTS[2].title}</CardTitle>
            </Card>
          </div>
        </Grid>
      </Page>
    </PageWrapper>
  );
};

export default BlogListPage;


