import React from 'react';
import LazyLoad from 'react-lazy-load'

import styles from './DemoItem.module.css';

type Props = {
    name: string;
    description: string;
    tags: string[];
    demoFile: string;
}

const DemoItem = ({
    name,
    description,
    tags,
    demoFile
}: Props) => {
    let demoDisplay = <img src={`demos/${name}/${demoFile}`} alt={name} />;

    const fileType = demoFile.split('.').pop();
    if (fileType === 'mp4') {
        demoDisplay = <video src={`demos/${name}/${demoFile}`} muted autoPlay loop />;
    }

    return (
        <li>
            <div className={styles.container}>
                <LazyLoad className={styles.media_container} threshold={0.95}>
                    {demoDisplay}
                </LazyLoad>
                <a className={styles.title} href={`demos/${name}/`}>{name}</a>
                <p>{description}</p>
                <ol className={styles.tag_container}>{tags.map(tag => <li className={styles.tag} key={tag}>{tag}</li>)}</ol>
            </div>
        </li>
    );
};

export default DemoItem;
