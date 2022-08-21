import React from 'react';
import DemoItem from './components/DemoItem';

import styles from './app.module.css';

const App = () => (
    <div className={styles.demo_content}>
        {window.demoData.map(item => (
            <DemoItem
                key={item.name}
                name={item.name}
                description={item.description}
                tags={item.tags}
                demoFile={item.demoFile}
            />
        ))}
    </div>
);

export default App;
