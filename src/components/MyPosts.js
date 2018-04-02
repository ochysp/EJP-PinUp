// @flow

import React from 'react'
import {db} from '../firebase';
import {PostNode} from "./PostNode";


type DbHandle = {
    detach: () => {},
}

type State = {
    posts: number[],
    dbHandle: DbHandle,
}

type Props = {}


export default class MyPosts extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            posts: [],
            dbHandle: db.onOwnPosts(
                this.keyEntered,
                this.keyLeft
            )
        };
    }

    componentWillUnmount() {
        this.state.dbHandle.detach();
    }

    keyEntered(key: number) {
        this.setState((prevState, props) => {
            const updatedNearbyPostKeys = prevState.posts.slice();
            updatedNearbyPostKeys.push(key);
            return {posts: updatedNearbyPostKeys};
        });
    };

    keyLeft(key: number) {
        this.setState((prevState, props) => {
            const updatedNearbyPostKeys = prevState.posts.slice();
            updatedNearbyPostKeys.splice(updatedNearbyPostKeys.indexOf(key), 1);
            return {posts: updatedNearbyPostKeys};
        });
    };

    render() {
        const listItems = this.state.posts.map((postId) =>
            <PostNode postId={postId}/>
        );
        return (
            <div>
                <h1>My Posts</h1>
                <div>
                    <ul>{listItems}</ul>
                </div>
                {/*<button onClick={*/}
                    {/*() => db.geoFireTest(this.keyEntered, this.keyLeft)*/}
                {/*}>*/}
                    {/*Create a test-post*/}
                {/*</button>*/}
            </div>
        );
    }

}
