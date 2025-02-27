import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const NetworkList = forwardRef(({ posts }, ref) => {
  const [activePostId, setActivePostId] = useState(null);
  const [highlightedPosts, setHighlightedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByType, setFilterByType] = useState('');
  
  // Filter posts based on search term and type
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterByType || post.category === filterByType;
    return matchesSearch && matchesType;
  });

  // Group posts by category
  const postsByCategory = filteredPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});

  // Create a lookup map for finding posts by ID
  const postsById = posts.reduce((acc, post) => {
    acc[post.databaseId] = post;
    return acc;
  }, {});

  useImperativeHandle(ref, () => ({
    applyEffect: (scrollPosition) => {
      // Example effect: highlight a random post based on scroll position
      if (posts.length > 0) {
        const index = Math.floor((scrollPosition / document.body.scrollHeight) * posts.length);
        setActivePostId(posts[Math.min(index, posts.length - 1)].databaseId);
      }
    }
  }));

  const handlePostClick = (postId) => {
    setActivePostId(postId === activePostId ? null : postId);
    
    if (postId === activePostId) {
      setHighlightedPosts([]);
    } else {
      // Find related posts
      const post = postsById[postId];
      if (post && post.related_posts && post.related_posts.length) {
        setHighlightedPosts([postId, ...post.related_posts]);
      } else {
        setHighlightedPosts([postId]);
      }
    }
  };

  // Get unique categories for the filter
  const categories = [...new Set(posts.map(post => post.category))];

  return (
    <div style={{ marginTop: "5rem" }} className="network-list">
      <div className="network-list-controls">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="network-list-search"
        />
        <select 
          value={filterByType} 
          onChange={(e) => setFilterByType(e.target.value)}
          className="network-list-filter"
        >
          <option value="">All types</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="network-list-content">
        {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
          <div key={category} className="network-list-category">
            <h3 className="network-list-category-title">{category}</h3>
            <ul className="network-list-items">
              {categoryPosts.map((post) => {
                const isActive = post.databaseId === activePostId;
                const isHighlighted = highlightedPosts.includes(post.databaseId);
                
                return (
                  <li 
                    key={post.databaseId}
                    className={`network-list-item ${isActive ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => handlePostClick(post.databaseId)}
                  >
                    <span className="post-title">{post.title}</span>
                    
                    {isActive && post.related_posts && post.related_posts.length > 0 && (
                      <div className="related-posts">
                        <h4>Related posts:</h4>
                        <ul>
                          {post.related_posts.map(relatedId => {
                            const relatedPost = postsById[relatedId];
                            return relatedPost ? (
                              <li key={relatedId} className="related-post-item">
                                {relatedPost.title} <span className="related-type">({relatedPost.category})</span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <style jsx>{`
        .network-list {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-height: 80vh;
          overflow-y: auto;
          padding: 16px;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .network-list-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .network-list-search, .network-list-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .network-list-search {
          flex-grow: 1;
        }
        
        .network-list-category {
          margin-bottom: 24px;
        }
        
        .network-list-category-title {
          border-bottom: 1px solid #eee;
          color: #555;
          font-size: 18px;
          margin-bottom: 12px;
          padding-bottom: 4px;
          text-transform: capitalize;
        }
        
        .network-list-items {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .network-list-item {
          background: #f9f9f9;
          border-left: 4px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 8px;
          padding: 12px;
          transition: all 0.2s ease;
        }
        
        .network-list-item:hover {
          background: #f0f0f0;
          transform: translateX(4px);
        }
        
        .network-list-item.active {
          background: #e9f5ff;
          border-left-color: #4285F4;
        }
        
        .network-list-item.highlighted {
          background: #f0f7ff;
        }
        
        .post-title {
          font-weight: 500;
        }
        
        .related-posts {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 4px;
          margin-top: 12px;
          padding: 8px 12px;
        }
        
        .related-posts h4 {
          color: #666;
          font-size: 14px;
          margin: 0 0 8px;
        }
        
        .related-posts ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .related-post-item {
          font-size: 13px;
          margin-bottom: 4px;
          padding-left: 12px;
          position: relative;
        }
        
        .related-post-item:before {
          content: "•";
          left: 0;
          position: absolute;
        }
        
        .related-type {
          color: #777;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
});

export default NetworkList;