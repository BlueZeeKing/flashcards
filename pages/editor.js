const firebase = require("firebase/app");
require("firebase/firestore");


const _ = require('lodash');

import Head from 'next/head'
import { useState } from "react"

export default function App(props) {

    return (
        <>
            <Head>
                <title>Flashcards</title>
                <meta name="description" content="A spanish flashcard app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="overflow-none">
                <h1 className="text-6xl font-extrabold text-center absolute w-screen top-0">Flash cards</h1>
                <Form submit={console.log} />
            </main>
        </>
    )
}

function Form(props) {
    const [state, changeInput] = useMultiTextInput(['title', 'yo', 'nosotros', 'tu', 'vosotros', 'el', 'ellos'])

    return (
        <div className="center-absolute bg-gray-200 shadow-lg w-80 h-56 flex-col flex">
            <div className="w-full p-2">
                <input name="title" type="text" placeholder="Title" className="text-center bg-blue-500 bg-opacity-0 outline w-full text-3xl font-bold outline-none focus:outline-none rounded-md" value={state['title']} onChange={changeInput} />
            </div>
            <div className="p-2 grid grid-cols-2 flex-grow">
                {['yo', 'nosotros', 'tu', 'vosotros', 'el', 'ellos' ].map((item, index) => {
                    if (item != 'vosotros') {
                        
                        return <input name={item} type="text" key={index} className="p-2 outline-none outline bg-white bg-opacity-0 border-gray-500 grid-item text-center" placeholder={item} value={state[item]} onChange={changeInput} />
                    }
                    return <input name={item} type="text" key={index} className="p-2 outline-none outline bg-white bg-opacity-0 border-gray-500 grid-item text-center" placeholder={item} disabled />
                })}
            </div>
            <button className="unselectable px-8 p-2 text-blue-500 focus:text-white border-2 border-blue-500 bg-blue-500 bg-opacity-0 focus:bg-opacity-100 outline-none focus:outline-none transition duration-500 rounded w-auto mx-8 my-2" onClick={() => {
                props.submit(state)
            }}>Create</button>
        </div>
    )
}

function useMultiTextInput(names) {
    let start = {}
    for (let i = 0; i < names.length; i++) {
        start[names[i]] = ''
    }

    const [state, setState] = useState(start)
    
    function change(e) {
        let copy = _.cloneDeep(state)
        copy[e.target.name] = e.target.value
        setState(copy)
    }

    return [state, change]
}