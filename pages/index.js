import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import Head from 'next/head'
import { useState } from "react"

export default function App(props) {
  let cards = []

  for (let i = 0; i < props.cards.length; i++) {
    let item = props.cards[i]
    for (let pronoun = 0; pronoun < Object.keys(item.cards).length; pronoun++) {
      cards.push([`${capitalizeFirstLetter(item.title)} ${capitalizeFirstLetter(Object.keys(item.cards)[pronoun])}`, capitalizeFirstLetter(item.cards[Object.keys(item.cards)[pronoun]])])
    }
  }

  shuffle(cards)

  return (
    <>
      <Head>
        <title>Flashcards</title>
        <meta name="description" content="A spanish flashcard app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="overflow-none">
        <h1 className="text-6xl font-extrabold text-center absolute w-screen top-0">Flash cards</h1>
        <CardList cards={cards}/>
      </main>
    </>
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

function CardList(props) {
  const [key, increment] = useSetCounter(0, props.cards.length-1)

  return (
    <>
      {props.cards.map((card, index) => {
        if (index > key - 2 && index < key + 2) {
          return <Card front={card[0]} back={card[1]} left={index < key} right={index > key} />
        } else if (key == props.cards.length - 1 && index == 0) {
          return <Card front={card[0]} back={card[1]} right />
        } else if (key == 0 && index == props.cards.length - 1) {
          return <Card front={card[0]} back={card[1]} left />
        }
      })}
      <button className="next-button unselectable px-8 p-2 text-blue-500 focus:text-white border-2 border-blue-500 bg-white focus:bg-blue-500 outline-none focus:outline-none transition duration-500 rounded w-auto" onClick={increment}>Next</button>
    </>
  )
}

function Card(props) {
  const [front, changeSide] = useState(true)

  let classes = "center-absolute bg-gray-200 shadow-lg w-80 h-44 p-4 center transition-all duration-700 relative "
  if (!front) { classes = classes + "center-absolute-flip " }

  let frontClass = "leading-none text-center text-bold text-3xl unselectable transition-all top-translate center-absolute ";
  let backClass = "leading-none text-center text-bold text-3xl unselectable transition-all center-absolute-flip center-absolute ";

  if (front) {
    backClass = backClass + "opacity-0 delay-200"
    frontClass = frontClass + "opacity-100 delay-300"
  } else {
    frontClass = frontClass + "opacity-0 delay-200"
    backClass = backClass + "opacity-100 delay-300"
  }

  if (props.left == true && front) {
    classes = classes + "left"
  } else if (props.left == true && !front) {
    classes = classes + "left-flipped"
  } else if (props.right == true) {
    classes = classes + "right"
  } else if (props.right == true && !front) {
    classes = classes + "right"
  }

  return (
    <div className={classes} onClick={() => { changeSide(!front) }}>
      <h2 className={frontClass}>{props.front}</h2>
      <h2 className={backClass}>{props.back}</h2>
    </div>
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

  let previous = count-1
  let next = count+1

  if (previous == start - 1) {
    previous = limit
  }
  if (next == limit + 1) {
    next = start
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

  return {
    props: {
      cards: snapshot.docs.map(doc => ({
        title: doc.id,
        cards: doc.data()
      }))
    }
  }
}