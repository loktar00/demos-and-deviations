import React from 'react';
import DemoItem from './components/DemoItem';

import './app.css';

const App = () => (
    <div>
        <ul className="demo_container">
            {window.demoData.map(item => (
                <DemoItem
                    key={item.name}
                    name={item.name}
                    description={item.description}
                    tags={item.tags}
                    demoFile={item.demoFile}
                />
            ))}
        </ul>
    </div>
);

export default App;
