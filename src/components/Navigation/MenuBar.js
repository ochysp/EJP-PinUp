/* eslint-disable no-throw-literal */
// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import * as routes from '../../constants/routes';
import { authentication } from '../../data/firebase';
import {menuBarStyle, logoutStyle} from '../../style/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
};

type Props = {
  history: any,
  classes: any,
  theme: any,
};

type State = {
  value: number,
};

class MenuBar extends React.Component<Props, State> {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    switch (value) {
      case 0:
        this.props.history.push(routes.HOME);
        break;
      case 1:
        this.props.history.push(routes.PINS);
        break;
      case 2:
        this.props.history.push(routes.POSTS);
        break;
      case 3:
        authentication.doSignOut();
        break;
      default:
        throw 'Not Implemented';
    }
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          style={menuBarStyle.primaryColor}
          centered
        >
          <Tab label="Home" />
          <Tab label="My Pins" />
          <Tab label="My Posts" />
          <Tab style={logoutStyle} label="Log Out" />
        </Tabs>

      </Paper>
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(MenuBar));
