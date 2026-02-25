import React from 'react';
import MuseLabSimple from './muse-lab-simple';

// This is a simple redirect component that immediately renders MuseLabSimple
// This gives us an additional URL path option for the deployed version
const MuseSimple = () => {
  return <MuseLabSimple />;
};

export default MuseSimple;