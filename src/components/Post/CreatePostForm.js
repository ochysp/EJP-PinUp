/* eslint-disable no-console,no-alert */
// @flow

import React from 'react';
import {
  Checkbox, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, Select,
  Grid,
  TextField,
  MenuItem,
  Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { savePost } from '../../business/Post';
import { CATEGORIES } from '../../constants/categories';
import type { AuthUserType, LocationType, PostType } from '../../business/Types';
import ConfirmationAlertDialog from '../FormComponents/ConfirmationAlertDialog';
import { formStyle } from '../../style/styles';

type State = {
  title: string,
  description: string,
  category: string,
  isEvent: boolean,
  invalidSubmit: boolean,
  sentToDB: boolean,
};

type Props = {
  classes: any,
  authUser: AuthUserType,
  position: LocationType,
  editablePost?: PostType,
  onDone: () => void,
};

class CreatePostForm extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.editablePost) {
      return ({
        title: nextProps.editablePost.title,
        description: nextProps.editablePost.description,
        category: nextProps.editablePost.category,
      });
    }
    return {};
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      category: '',
      isEvent: false,
      invalidSubmit: false,
      sentToDB: false,
    };
  }

  handleClose = () => {
    if (this.props.onDone) {
      this.props.onDone();
    }
  };

  handleSubmit = (event: any) => {
    if (this.state.title !== '' && this.state.category !== '' && this.state.description !== '') {
      if (event) { event.preventDefault(); }

      const post: postType = {
        userId: this.props.authUser.uid,
        title: this.state.title,
        description: this.state.description,
        category: this.state.category,
      };

      if (this.state.isEvent) {
        post.event = {
          participants: {},
          date: Date.now(),
        };
      }

      if (this.props.editablePost) {
        post.postId = this.props.editablePost.postId;
      } else {
        post.location = {
          latitude: parseFloat(this.props.position.latitude),
          longitude: parseFloat(this.props.position.longitude),
        };
      }

      savePost(
        post,
        () => { this.setState({ sentToDB: true }); },
        (error) => { console.log('error:'); console.log(error); },
      );

      this.setState({ invalidSubmit: false });
      this.handleClose();
    } else {
      this.setState({ invalidSubmit: true });
    }
  };

  handleChange = name => (event) => {
    const newState = {};
    if (event.target.type === 'checkbox') {
      newState[name] = event.target.checked;
    } else {
      newState[name] = event.target.value;
    }
    this.setState(newState);
  };

  render() {
    const { classes } = this.props;
    const savedAlert = this.state.sentToDB ? (<ConfirmationAlertDialog infoText="Post" />) : null;

    return (
      <div>
        {savedAlert}
        <Dialog
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container spacing={36} className={classes.grid}>
              <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>

              <DialogContent>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    id="title"
                    onChange={this.handleChange('title')}
                    helperText={this.state.invalidSubmit && this.state.title === '' ? 'Requires a Title' : ''}
                    error={this.state.invalidSubmit && this.state.title === ''}
                    value={this.state.title}
                    className={classes.titleField}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    id="description"
                    onChange={this.handleChange('description')}
                    helperText={this.state.invalidSubmit && this.state.description === '' ? 'Requires a description' : ''}
                    error={this.state.invalidSubmit && this.state.description === ''}
                    value={this.state.description}
                    className={classes.descriptionField}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    className={classes.formControl}
                    error={this.state.invalidSubmit && this.state.category === ''}
                  >
                    <InputLabel htmlFor="select-category">Category</InputLabel>
                    <Select
                      value={this.state.category}
                      onChange={this.handleChange('category')}
                      input={<Input name="category" id="select-category" />}
                      className={classes.categoryField}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {Object.entries(CATEGORIES).map(category => (
                        <MenuItem key={category[0]} value={category[0]}>
                          {category[1]}
                        </MenuItem>
                  ))}

                    </Select>
                    { this.state.invalidSubmit
                && this.state.category !== ''
                && (<FormHelperText>Requires a category</FormHelperText>)}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="isEvent"
                        checked={this.state.isEvent}
                        onChange={this.handleChange('isEvent')}
                        value="This is an event"
                      />
                  }
                    label="Users can sign up"
                  />
                </Grid>

              </DialogContent>
            </Grid>
          </form>

          <div
            tabIndex={0}
            role="button"
            onKeyDown={this.handleClose}
          >
            <DialogActions>
              <Button
                className={classes.buttonCancel}
                onClick={this.handleClose}
              >Cancel
              </Button>
              <Button
                id="Save"
                color="secondary"
                className={classes.buttonSave}
                onClick={this.handleSubmit}
              >Save
              </Button>
            </DialogActions>
          </div>

        </Dialog>
      </div>
    );
  }
}

export default withStyles(formStyle)(CreatePostForm);
