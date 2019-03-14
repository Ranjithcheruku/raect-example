import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from "@material-ui/core/Grid";
import { Query, Mutation } from 'react-apollo';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});


class RepositoryCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, repository } = this.props;
    const repoQuery = gql`
    {
        repository(owner: "the-road-to-learn-react", name: "${repository.name}") {
         
          
            updatedAt
            description
            nameWithOwner
            id
            name
            url
            mentionableUsers(last: 10) {
                    
              nodes {
                name
                contributionsCollection(organizationID: "MDEyOk9yZ2FuaXphdGlvbjMyOTQ5MDE2") {
                  
                  totalCommitContributions
                }
              }
            }
            viewerHasStarred
              
                stargazers {
                totalCount
              }
          }
        
        }
      
    `
    

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {repository.name[0]}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={repository.name}
          subheader={`Updated ${repository.updatedAt}`}
        />
        {/* <CardMedia
          className={classes.media}
          image="/static/images/cards/paella.jpg"
          title="Paella dish"
        /> */}
        <CardContent>
          <Typography component="p">
           {repository.description}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
          <Typography variant="caption" gutterBottom>
        {repository.stargazers.totalCount}
      </Typography>
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Statistics</Typography>
            <Query query={repoQuery}>
                 {({ data: { repository } = {}, loading }) => {
                    if (loading || !repository) {
                        return <div>Loading ...</div>;
                }
                let commitList = [ ...repository.mentionableUsers.nodes];
                commitList = commitList.filter(row => row.name && row.name.length > 0)
                commitList.sort((a,b) => b.contributionsCollection.totalCommitContributions - a.contributionsCollection.totalCommitContributions);
            
                commitList = commitList.slice(0,4);
                
                
                return <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell align="right">Commits</TableCell>
                  
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commitList.map(row => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.contributionsCollection.totalCommitContributions}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                
                }}
            </Query>
            <Typography>
              Contributors
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
     
    );
  }
}

RepositoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RepositoryCard);
