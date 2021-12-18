import { createContext, useReducer, useState } from "react";
import { postReducer } from "../reducer/postReducer";
import {
  apiUrl,
  POSTS_LOADED_FAIL,
  POSTS_LOADED_SUCCESS,
  ADD_POST,
  DELETE_POST,
  UPDATE_POST,
  GET_POST_BY_ID,
} from "./constants";
import axios from "axios";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
  //State
  const [postState, dispatch] = useReducer(postReducer, {
    post: null,
    posts: [],
    postsLoading: true,
  });

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: null,
  });

  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showUpdatePostModal, setShowUpdatePostModal] = useState(false);
  //   Get all posts
  const getPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts`);
      if (response.data.success) {
        dispatch({ type: POSTS_LOADED_SUCCESS, payload: response.data.posts });
      }
    } catch (error) {
      dispatch({ type: POSTS_LOADED_FAIL });
    }
  };
  // Add new Post
  const addPost = async (newPost) => {
    try {
      const response = await axios.post(`${apiUrl}/posts`, newPost);
      if (response.data.success) {
        dispatch({ type: ADD_POST, payload: response.data.post });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { sucess: false, message: "Server error" };
    }
  };
  // Delete post
  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${apiUrl}/posts/${postId}`);
      if (response.data.success) {
        dispatch({ type: DELETE_POST, payload: postId });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { sucess: false, message: "Server error" };
    }
  };
  // Update post
  const updatePost = async (updatedPost) => {
    try {
      const response = await axios.put(
        `${apiUrl}/posts/${updatedPost._id}`,
        updatedPost
      );
      if (response.data.success) {
        dispatch({
          type: UPDATE_POST,
          payload: response.data.post,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { sucess: false, message: "Server error" };
    }
  };
  // Get post update id
  const getUpdatePost = (postId) => {
    debugger;
    const post = postState.posts.find((post) => post._id === postId);
    dispatch({ type: GET_POST_BY_ID, payload: post });
  };
  // Post context data
  const postContextData = {
    postState,
    getPosts,
    showAddPostModal,
    setShowAddPostModal,
    addPost,
    showToast,
    setShowToast,
    deletePost,
    updatePost,
    getUpdatePost,
    showUpdatePostModal,
    setShowUpdatePostModal,
  };

  return (
    <PostContext.Provider value={postContextData}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
