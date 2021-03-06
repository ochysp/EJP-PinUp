/* eslint-disable no-throw-literal */
// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Tab, Tabs } from '@material-ui/core';
import * as routes from '../../constants/routes';
import { authentication } from '../../data/firebase';
import { menuBarStyles } from '../../style/styles';


type Props = {
  history: any,
  classes: any,
// eslint-disable-next-line react/no-unused-prop-types
  location: any,
};

type State = {
  value: number,
};

class MenuBar extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props) {
    const path = nextProps.location.pathname;
    if (path.startsWith(routes.POSTS)) {
      return { value: 2 };
    }
    if (path.startsWith(routes.PINS)) {
      return { value: 1 };
    }
    if (path.startsWith(routes.HOME)) {
      return { value: 0 };
    }
    return null;
  }

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
      default:
        throw 'Not Implemented';
    }
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <div className={classes.flexContainer}>

          <div className={classes.flexItemLeft} />

          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            className={classes.menuBar}
            centered
          >
            <Tab label="Home" />
            <Tab label="My Pins" />
            <Tab label="My Posts" />
          </Tabs>

          <div className={classes.flexLogout} >
            <Button variant="outlined" size="small" color="secondary" className={classes.logoutButton} onClick={authentication.doSignOut}>
            LogOut
            </Button>
          </div>

        </div>
      </Paper>
    );
  }
}

export default withRouter(withStyles(menuBarStyles)(MenuBar));
