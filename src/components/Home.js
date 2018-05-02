// @flow
/* eslint-disable react/jsx-no-bind,react/sort-comp,react/no-string-refs */

import React from 'react';
import { Map, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import type { LatLng } from 'react-leaflet/es/types';
import Button from 'material-ui/Button';
import { detachAllPinListeners, listenForAllPinsOfUser, deletePin } from '../business/Pin';
import { detachAllPostListeners, listenForAllPostsOfUser, deletePost } from '../business/Post';
import CreatePinForm from './Pin/CreatePinForm';
import CreatePostForm from './Post/CreatePostForm';
import * as leafletValues from '../constants/leafletValues';
import type { AuthUserType, LocationType, PinType, PostType, SnapshotType } from '../business/Types';
import SelectionDrawer from './MaterialComponents/SelectionDrawer';

const convertToLeafletLocation = (location: LocationType): LatLng => (
  { lat: location.latitude, lng: location.longitude }
);

const convertToLocationType = (location: LatLng): LocationType => {
  if (location.lat && location.lng && typeof location.lat === 'number' && typeof location.lng === 'number') {
    return { latitude: location.lat, longitude: location.lng };
  }
  // eslint-disable-next-line no-throw-literal
  throw 'unknown leaflet location type';
};

const convertToLeafletRadius = (radius: number): number => (radius * 1000);

type State = {
  center: LatLng,
  zoom: number,

  marker: LatLng,
  markerIsSet: boolean,
  isPin: boolean,
  isPost: boolean,

  pins: Array<PinType>,

  drawer: boolean,
  posts: Array<PostType>,
};

type Props = {
  authUser: AuthUserType
};

export default class Home extends React.Component<Props, State> {
  constructor() {
    super();

    const position = { lat: leafletValues.LAT, lng: leafletValues.LNG };

    this.state = {
      center: position,
      zoom: leafletValues.ZOOM,

      marker: position,
      markerIsSet: false,
      isPin: false,
      isPost: false,

      pins: [],
      posts: [],

      drawer: false,
    };
  }

  componentDidMount() {
    listenForAllPinsOfUser(this.props.authUser.uid, (snapshot: SnapshotType) => {
      if (snapshot.val() === null) {
        this.setState({ pins: [] });
      } else {
        this.setState({
          pins: Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
            pinId: key,
            ...value,
          })),
        });
      }
    });

    listenForAllPostsOfUser(this.props.authUser.uid, (snapshot: SnapshotType) => {
      if (snapshot.val() === null) {
        this.setState({ posts: [] });
      } else {
        this.setState({
          posts: Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
            postId: key,
            ...value,
          })),
        });
      }
    });
  }

  setMarker = (e: any) => {
    const position = e.latlng;
    this.setState({
      markerIsSet: true,
      marker: position,
      drawer: true,
      isPin: false,
      isPost: false,
    });
  };

  handleSetPin = () => {
    this.setState({ isPin: true, isPost: false, drawer: false });
  };
  handleSetPost = () => {
    this.setState({ isPost: true, isPin: false, drawer: false });
  };
  unsetMarker = () => {
    this.setState({ markerIsSet: false });
  }

  handleDeletePin = (pin: PinType) => () => {
    if (pin.pinId) {
      deletePin(this.props.authUser, pin.pinId);
      this.unsetMarker();
    } else {
      // eslint-disable-next-line no-throw-literal
      throw 'pin can not be deleted because no pinId was provided';
    }
  };

  handleDeletePost = (post: PostType) => () => {
    if (post.postId) {
      deletePost(this.props.authUser, post);
      this.unsetMarker();
    } else {
      // eslint-disable-next-line no-throw-literal
      throw 'post can not be deleted because no postId was provided';
    }
  };

  render() {
    const {
      marker, center, zoom, markerIsSet, isPin, isPost,
    } = this.state;

    const pinForm = isPin ? (
      <CreatePinForm authUser={this.props.authUser} position={convertToLocationType(marker)} />
    ) : null;

    const postForm = isPost ? (
      <CreatePostForm authUser={this.props.authUser} position={convertToLocationType(marker)} />
    ) : null;

    const currentMarker = markerIsSet ? (
      <Marker position={marker} ref="marker" />
    ) : null;

    const selectionDrawer = markerIsSet ? (
      <SelectionDrawer
        handleSetPin={this.handleSetPin}
        handleSetPost={this.handleSetPost}
        drawer={this.state.drawer}
      />
    ) : null;

    return (
      <div>
        <Map center={center} zoom={zoom} onClick={this.setMarker}>
          <TileLayer
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />

          {this.state.pins.map((pin: PinType, index) => (
            <Marker key={pin.pinId} position={convertToLeafletLocation(pin.area.location)}>
              <Popup>
                <span>
                  {pin.title} #{index}
                  <br />
                  {pin.categories}
                  <br />
                  <Button onClick={this.handleDeletePin(pin)}>
                    Delete Pin
                  </Button>
                </span>
              </Popup>
              <Circle
                center={convertToLeafletLocation(pin.area.location)}
                radius={convertToLeafletRadius(pin.area.radius)}
              />
            </Marker>
          ))}

          {this.state.posts.map((post: PostType, index) => (
            <Marker key={post.postId} position={convertToLeafletLocation(post.location)}>
              <Popup>
                <span>
                  {post.title} #{index}
                  <br />
                  {post.category.name}
                  <br />
                  <Button onClick={this.handleDeletePost(post)}>
                    Delete Post
                  </Button>
                </span>
              </Popup>
            </Marker>
          ))}
          {currentMarker}
        </Map>
        {selectionDrawer}
        {pinForm}
        {postForm}
      </div>
    );
  }

  componentWillUnmount() {
    detachAllPinListeners();
    detachAllPostListeners();
  }
}
