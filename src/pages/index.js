import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import PostDate from '../components/Date';
import Preview from '../components/Preview';
import Tags from '../components/Tags';

const getParams = search => {
  return search.replace('?', '').split('&').reduce((params, keyValue) => {
    const [key, value = ''] = keyValue.split('=');
    if (key && value) {
      params[key] = value.match(/^\d+$/) ? +value : value;
    }
    return params;
  }, {});
};

export default function Index({ data, location }) {
  const { edges: posts } = data.allMarkdownRemark;
  const { start = 0, end = 10 } = getParams(location.search);
  return (
    <div>
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .slice(start, end)
        .map(({ node: post }) => {
          return (
            <div key={post.id}>
              <Preview
                excerpt={post.frontmatter.description || post.excerpt}
                date={post.frontmatter.date}
                title={post.frontmatter.title}
                to={post.frontmatter.path}
              />
            </div>
          );
        })}
    </div>
  );
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            title
          }
        }
      }
    }
  }
`;
