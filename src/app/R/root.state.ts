/*
 -- Immutable.js records are an awesome addition to your app. Why?
 + They're self-documenting. Any developer will be able to see all the fields within a resource/record
 + They enforce strict code quality. You can't add undocumented fields to a record.
 + They combine the benefits of ImmutableJS' Map() with normal JS objects. They have standard accessors (post.name vs post.get('name')), you can use
 destructuring, and they have Immutable's strict equality. You can use getIn within maps and records. If a map contains records you can read
 record's values using getIn.
 */

import {Map} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

// The TypeScript interface that defines the application state's properties.
// This is to be imported wherever a reference to the app state is used
// (reducers, components, services...)
export interface RootState {
  loading: boolean;
  additionData: Map<string, any>;
}

// An Immutable.js Record implementation of the RootState interface.
// This only needs to be imported by reducers, since they produce new versions
// of the state. Components should only ever read the state, never change it,
// so they should only need the interface, not the record.
export interface RootStateRecord extends TypedRecord<RootStateRecord>, RootState {}

// An Immutable.js record factory for the record.
// See function to know more.
export const rootStateFactory = makeTypedFactory<RootState, RootStateRecord>({
                                                                               loading: false,
                                                                               additionData: Map.of()
                                                                             });
