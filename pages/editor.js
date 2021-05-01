import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const _ = require('lodash');

import Head from 'next/head'
import { useState } from "react"

export default function App(props) {
    const [msg, setMsg] = useMsg()
    var firebaseConfig = {
        apiKey: "AIzaSyBWdow9c513miZ7VuPuNTcRCqa9q7E_iTc",
        authDomain: "spanish-notes-b9090.firebaseapp.com",
        databaseURL: "https://spanish-notes-b9090-default-rtdb.firebaseio.com",
        projectId: "spanish-notes-b9090",
        storageBucket: "spanish-notes-b9090.appspot.com",
        messagingSenderId: "573999750087",
        appId: "1:573999750087:web:29c87c35e2c80cb5a817e2"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    } else {
        firebase.app(); // if already initialized, use that one
    }
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...

                setMsg('Successfully signed in')
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;

                setMsg('Error signing in')
                // ...
            });
    }

    console.log(msg)
    return (
        <>
            <Head>
                <title>Flashcards</title>
                <meta name="description" content="A spanish flashcard app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="overflow-none">
                <h1 className="left-0 text-6xl font-extrabold text-center absolute w-screen top-0">Flash cards</h1>
                <Form submit={(newCard) => {
                    firebase.firestore().collection('cards').doc(newCard.title).set(newCard.cards).then(() => {
                            console.log("Document successfully written!");
                            setMsg('Success')
                        }).catch((error) => {
                            console.error("Error writing document: ", error);
                            setMsg('Error Adding Cards')
                        });
                }} />
                <h3 className="left-0 text-2xl font-bold text-center absolute w-screen bottom-0">{msg}</h3>
            </main>
        </>
    )
}

function Form(props) {
    const [cards, changeCardsInput] = useMultiTextInput(['yo', 'nosotros', 'tu', 'el', 'ellos'])
    const [title, changeTitleInput] = useTextInputWithoutSlash()

    return (
        <div className="center-absolute bg-gray-200 shadow-lg w-80 h-56 flex-col flex">
            <div className="w-full p-2">
                <input name="title" type="text" placeholder="Title" className="text-center bg-blue-500 bg-opacity-0 outline w-full text-3xl font-bold outline-none focus:outline-none rounded-md" value={title} onChange={changeTitleInput} />
            </div>
            <div className="p-2 grid grid-cols-2 flex-grow">
                {['yo', 'nosotros', 'tu', 'vosotros', 'el', 'ellos' ].map((item, index) => {
                    if (item != 'vosotros') {
                        
                        return <input name={item} type="text" key={index} className="p-2 outline-none outline bg-white bg-opacity-0 border-gray-500 grid-item text-center" placeholder={item} value={cards[item]} onChange={changeCardsInput} />
                    }
                    return <input name={item} type="text" key={index} className="p-2 outline-none outline bg-white bg-opacity-0 border-gray-500 grid-item text-center" placeholder={item} disabled />
                })}
            </div>
            <button className="unselectable px-8 p-2 text-blue-500 focus:text-white border-2 border-blue-500 bg-blue-500 bg-opacity-0 focus:bg-opacity-100 outline-none focus:outline-none transition duration-500 rounded w-auto mx-8 my-2" onClick={() => {
                props.submit({
                    title: title,
                    cards: cards
                })
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

function useTextInputWithoutSlash() {
    const [state, setState] = useState('')

    function change(e) {
        setState(e.target.value.replace(/\//g, "-"))
    }

    return [state, change]
}

function useMsg() {
    const [msg, setMsg] = useState('')

    function change(msg) {
        console.log(msg)
        setMsg(msg)

        setTimeout(() => {
            setMsg('')
        }, 2000)
    }

    return [msg, change]
}