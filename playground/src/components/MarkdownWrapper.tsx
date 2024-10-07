'use client';

import Markdown from "react-markdown";

const MarkdownWrapper = ({ README } : { README: string }) => {

    console.log(typeof README)
    return (
        <div className='markdown'>
            <Markdown>{README}</Markdown>
        </div>
    )
}

export default MarkdownWrapper;