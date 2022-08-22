import React from 'react';
import DemoItem from './components/DemoItem';

import styles from './app.module.css';

const App = () => (
    <div>
        <ul className={styles.demo_container}>
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
