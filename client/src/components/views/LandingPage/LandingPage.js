import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {

  useEffect(() => { 
    axios.get('/api/hello').then(response => console.log(response.data)) //백엔드 서버와 소통
  }, [])

  return (
    <div>
      LandingPage
    </div>
  );
}

export default LandingPage;
