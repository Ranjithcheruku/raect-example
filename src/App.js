import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import RepositoryCard from './RepositoryCard';
import Grid from '@material-ui/core/Grid';

import './App.css';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
{
  organization(login: "the-road-to-learn-react") {
    repositories(first: 20) {
     
      nodes {
        description
        updatedAt
        nameWithOwner
        id
        name
        url
        viewerHasStarred
          commitComments(last: 100) {
            nodes {
              author {
                avatarUrl
                login
              }
            }
          }
          stargazers {
            totalCount
          }
      }
    
    }
  }
}

`;

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const App = () => (
  <Query query={GET_REPOSITORIES_OF_ORGANIZATION}>
    {({ data: { organization } = {}, loading }) => {
      if (loading || !organization) {
        return <div>Loading ...</div>;
      }

      return (
        <Repositories repositories={organization.repositories} />
      );
    }}
  </Query>
);

class Repositories extends React.Component {
  state = {
    selectedRepositoryIds: [],
  };

  toggleSelectRepository = (id, isSelected) => {
    let { selectedRepositoryIds } = this.state;

    selectedRepositoryIds = isSelected
      ? selectedRepositoryIds.filter(itemId => itemId !== id)
      : selectedRepositoryIds.concat(id);

    this.setState({ selectedRepositoryIds });
  };

  render() {
    return (
      <React.Fragment>
      {/* <RepositoryList
        repositories={this.props.repositories}
        selectedRepositoryIds={this.state.selectedRepositoryIds}
        toggleSelectRepository={this.toggleSelectRepository}
      /> */}
     
      <Grid container spacing={24}>
        {this.props.repositories.nodes.map((repository) => 
        <Grid item md={3} > 
        <RepositoryCard repository={repository} />
      </Grid>)}
          
        
      </Grid>
      </React.Fragment>
    );
  }
}

const RepositoryList = ({
  repositories,
  selectedRepositoryIds,
  toggleSelectRepository,
}) => (
  <ul>
    {repositories.edges.map(({ node }) => {
      const isSelected = selectedRepositoryIds.includes(node.id);

      const rowClassName = ['row'];

      if (isSelected) {
        rowClassName.push('row_selected');
      }

      return (
        <li className={rowClassName.join(' ')} key={node.id}>
          <Select
            id={node.id}
            isSelected={isSelected}
            toggleSelectRepository={toggleSelectRepository}
          />{' '}
          <a href={node.url}>{node.name}</a>{' '}
          {!node.viewerHasStarred && <Star id={node.id} />}
        </li>
      );
    })}
  </ul>
);

const Star = ({ id }) => (
  <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
    {starRepository => (
      <button type="button" onClick={starRepository}>
        Star
      </button>
    )}
  </Mutation>
);

const Select = ({ id, isSelected, toggleSelectRepository }) => (
  <button
    type="button"
    onClick={() => toggleSelectRepository(id, isSelected)}
  >
    {isSelected ? 'Unselect' : 'Select'}
  </button>
);

export default App;
