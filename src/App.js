import React from 'react';
import dancer from './pics/cute_shark.png';
import RenderFella from './modules/SharkFellaCss';

function App() {

    return (
        <>
          <RenderFella imageUrl={dancer} />
        </>
    );
}

export default App;
