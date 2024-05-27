import React, { useState, useEffect } from 'react';

const useProgressBar = () => {
  const [progress, setProgress] = useState(120);

  const startProgress = () => {
    setProgress(0);
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  useEffect(() => {
    return () => {
      // Clean up logic if needed
    };
  }, []);

  return { progress, startProgress, updateProgress };
};

export default useProgressBar;

