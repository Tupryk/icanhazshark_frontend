import React from 'react';
import dancer from './pics/cute_shark.png';
import RenderFella from './modules/SharkFella';

function App() {

    return (
        <>
          <RenderFella imageUrl={dancer} quote={"Hello world"} size={2}/>
        </>
    );
}

export default App;
