import React from 'react';

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
    let demoDisplay = <img width="300px" src={`demos/${name}/${demoFile}`} alt={name} />;

    const fileType = demoFile.split('.').pop();
    if (fileType === 'mp4') {
        demoDisplay = <video width="300px" src={`demos/${name}/${demoFile}`} muted autoPlay loop />;
    }

    return (
        <a href={`demos/${name}/`}>
            <div>
                <h3>{name}</h3>
                {demoDisplay}
                <p>{description}</p>
                <p>{tags.join(', ')}</p>
            </div>
        </a>
    );
};

export default DemoItem;
