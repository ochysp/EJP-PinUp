// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styles } from '../../style/styles';
import { CATEGORIES } from '../../constants/categories';


type Props = {
  postId: KeyType,
  authUser: AuthUserType,
  classes: any,
};

type State = {
  postData: ?PostType,
  isDetailViewOpen: boolean,
  dbReady: boolean,
};

// eslint-disable-next-line import/prefer-default-export
class PostListEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      postData: null,
      isDetailViewOpen: false,
    };
  }

  componentDidMount() {
    listenForPostData(this.props.postId,
      (post: PostType) => {
        this.updateData(post);
      });
  }

  componentWillUnmount() {
    detachPostListener(this.props.postId);
  }

  updateData = (values: PostType) => {
    const newState = { postData: values };
    this.setState(newState);
  };

  handleClickOpen = () => {
    this.setState({
      isDetailViewOpen: true,
    });
  };

  handleClose = () => {
    this.setState({ isDetailViewOpen: false });
  };

  render() {
    return (
      <div>
        <ListItem button onClick={this.handleClickOpen}>
          <Avatar>
            {this.state.postData ?
              <Typography variant="headline" className={this.props.classes.iconStyle}>
                {CATEGORIES[this.state.postData.category].charAt(0)}
              </Typography>
              : <CircularProgress />}

          </Avatar>
          <ListItemText primary={this.state.postData ? this.state.postData.title : ''} />

        </ListItem>
        {this.state.postData &&
          <Dialog
            open={this.state.isDetailViewOpen}
            onClose={this.handleClose}
            aria-labelledby="simple-dialog-title"
          >
            <DialogTitle
              id="simple-dialog-title"
              className={this.props.classes.postDetailDialog}
            >
              {this.state.postData.title}
            </DialogTitle>
            <PostDetails
              postData={this.state.postData}
              authUser={this.props.authUser}
              onCloseClicked={this.handleClose}
            />
          </Dialog>}
      </div>
    );
  }
}

export default withStyles(styles)(PostListEntry);
