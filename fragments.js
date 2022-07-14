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

export const ME_FRAGMENT = gql`
  fragment MeFragment on User {
    id
    name
    avatar
    region
    bio
    community {
      id
      communityName
      communityLogo
    }
    directFeedNumber
    directCommentNumber
    directLikeNumber
    directPoemNumber
  }
`;

export const POEM_FRAGMENT = gql`
  fragment PoemFragement on Poem {
    id
    poemTitle
    poemCaption
    createdAt
    updatedAt
    user {
      id
      name
      avatar
    }
    poemLikeNumber
    poemCommentNumber
    isMine
    isLiked
  }
`;

export const POEM_COMMENT_FRAGMENT = gql`
  fragment PoemCommentFragment on Poemcomment {
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
