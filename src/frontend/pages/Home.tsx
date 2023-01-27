import HomeItem from "../components/HomeItem"
import HomeMenu from "../components/HomeMenu";
import { BiUserPlus, BiWorld, BiPencil, BiEdit } from "react-icons/bi/index.js"
import React, { useState } from "react";
import Feedback from "../components/FeedBack";

export default function Home(){

  const [ feedbackVisible, setFeedbackVisible ] = useState(false);

  function onEnterFeedback(){
    setFeedbackVisible(true);
  }

  function onExitFeedback(){
    setFeedbackVisible(false)
  }
  
  return (
    <>
      <Feedback visible={feedbackVisible} onClose={onExitFeedback}/>
      <HomeMenu>
        <HomeItem
          type="Character"
          description='Create a character with story and characteristics'
          icon={BiUserPlus}
          href="/create/character"
        />
        <HomeItem
          type="World"
          description='Create a world with story, characteristics, characters, places, ...'
          icon={BiWorld}
          href="/create/world"
        />
        <HomeItem
          type="Story"
          description='Create a rich story in a world with characters'
          icon={BiPencil}
          href="/create/story"
        />
        <HomeItem
          type="Feedback"
          description='Submit Feedback to improve the site!'
          icon={BiEdit}
          onclick={onEnterFeedback}
        />
      </HomeMenu>
    </>
  );
}
