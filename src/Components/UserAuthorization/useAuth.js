// Create access token to handle api

import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();
  
    // Login Part
    useEffect(() => {
      axios
        .post("https://lyquochao84.github.io/MusicStreamingPlatform/login", {
          code,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setRefreshToken(res.data.refreshToken)
          setExpiresIn(res.data.expiresIn)
          window.history.pushState({}, null, "/")
        })
        .catch(() => {
          window.location = '/';
        })
    }, [code])

    // Refresh Part
    useEffect(() => {
        if (!refreshToken || !expiresIn) {
            return;
        } 
        const interval = setInterval(() => {
          axios
            .post("https://lyquochao84.github.io/MusicStreamingPlatform/refresh", {
              refreshToken,
            })
            .then(res => {
              setAccessToken(res.data.accessToken)
              setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
              window.location = "/"
            })
        }, (expiresIn - 60) * 1000)
    
        return () => clearInterval(interval)
      }, [refreshToken, expiresIn])
    
      return accessToken;
}