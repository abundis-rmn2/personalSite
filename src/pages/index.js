import React from 'react';
import ThesisList from '../components/ThesisList';
import ArticleList from '../components/ArticleList';
import TalkList from '../components/TalkList';
import CodeProjectsList from '../components/CodeProjectsList';
import MultimediaList from '../components/MultimediaList';
import MediaAppareancesList from '../components/MediaAppareancesList';
import GlobalList from '../components/GlobalList';

const HomePage = () => (
  <>
    <div>
      <h1>Chabelita punto com</h1>
      <ThesisList />
      <ArticleList />
      <TalkList />
      <CodeProjectsList />
      <MultimediaList />
      <MediaAppareancesList />
    </div>
    <div>
      <GlobalList />
    </div>
  </>
);

export default HomePage;