import React, {useEffect, useState} from 'react'
import Form from '../Form/Form'
function Create({web3}) {
    const [currentId, setCurrentId] = useState(0);

    return (
        <div>
            <Form currentId={currentId} setCurrentId={setCurrentId} web3={web3}/>
        </div>
    )
}

export default Create