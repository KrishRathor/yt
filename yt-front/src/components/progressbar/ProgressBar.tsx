import React from 'react';

interface progressProps {
  progress: number
}

const ProgressBar: React.FC<progressProps> = (props) => {
  
  const { progress } = props;
  return (
    <>
      {progress < 100 && (
        <div className="w-full h-[0.5px] bg-gray-300 rounded">
          <div className="h-full bg-red-500 rounded" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </>
  );
};

export default ProgressBar;

