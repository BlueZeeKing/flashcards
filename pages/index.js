const firebase = require("firebase");
require("firebase/firestore");

import Head from 'next/head'
import { useState } from "react"

export default function App(props) {
  let cards = []

  for (let i = 0; i < props.cards.length; i++) {
    let item = props.cards[i]
    console.log(item)
    for (let pronoun = 0; pronoun < Object.keys(item.cards).length; pronoun++) {
      console.log(pronoun)
      cards.push([`${capitalizeFirstLetter(item.title)} ${capitalizeFirstLetter(Object.keys(item.cards)[pronoun])}`, capitalizeFirstLetter(item.cards[Object.keys(item.cards)[pronoun]])])
    }
  }

  shuffle(cards)

  return (
    <div>
      <Head>
        <title>Flashcards</title>
        <meta name="description" content="A spanish flashcard app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="center h-screen overflow-none">
        <h1 className="text-6xl font-extrabold text-center absolute w-screen top-0">Flash cards</h1>
        <Card cards={cards}/>
      </main>
    </div>
  )
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function Card(props) {
  const [key, increment] = useSetCounter(0, props.cards.length)
  const [front, changeSide] = useState(true)

  let classes = "bg-gray-200 shadow-lg w-80 h-44 p-4 center transition-all duration-700 relative "
  if (!front) { classes = classes + "flip " }

  let frontClass = "transform leading-none text-center text-bold text-3xl unselectable transition-all top-translate center-absolute ";
  let backClass = "transform leading-none text-center text-bold text-3xl unselectable transition-all center-absolute-flip center-absolute ";

  if (front) {
    backClass = backClass + "opacity-0 delay-0"
    frontClass = frontClass + "opacity-100 delay-700"
  } else {
    frontClass = frontClass + "opacity-0 delay-0"
    backClass = backClass + "opacity-100 delay-700"
  }

  return (
    <>
      <div className={classes} onClick={() => { changeSide(!front) }}>
        <h2 className={frontClass}>{props.cards[key][0]}</h2>
        <h2 className={backClass}>{props.cards[key][1]}</h2>
      </div>
      <button className="unselectable px-4 p-2 m-4 text-blue-500 focus:text-white border-2 border-blue-500 bg-white focus:bg-blue-500 outline-none focus:outline-none transition duration-500 rounded w-auto" onClick={() => {
        increment()
        changeSide(true)
      }}>Next</button>
    </>
  )
}

function useSetCounter(start, limit) {
  const [count, setCount] = useState(start)

  function increment() {
    if (count == limit) {
      setCount(0)
    } else {
      setCount(count + 1)
    }
  }

  return [count, increment]
}


export async function getStaticProps(context) {
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


  const snapshot = await firebase.firestore().collection('cards').get()

  console.log(snapshot.docs.map(doc => ({
    title: doc.id,
    cards: doc.data()
  })))

  return {
    props: {
      cards: snapshot.docs.map(doc => ({
        title: doc.id,
        cards: doc.data()
      }))
    }
  }
}