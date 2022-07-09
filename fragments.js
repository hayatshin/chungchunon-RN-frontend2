import { gql } from "@apollo/client";

export const FEED_FRAGMENT = gql`
  fragment FeedFragment on Feed {
    id
    user {
      id
      name
      avatar
    }
    photos
    caption
    createdAt
    updatedAt
    likeNumber
    comments {
      id
      user {
        name
      }
      payload
      createdAt
      updatedAt
    }
    commentNumber
    isMine
    isLiked
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    user {
      name
      avatar
    }
    payload
    createdAt
    updatedAt
  }
`;
