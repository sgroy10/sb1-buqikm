import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://jewelry-viz.pockethost.io');

export const COLLECTIONS = {
  USERS: 'users', // Using the default PocketBase users collection
};