import HomeItem from "../components/HomeItem"
import HomeMenu from "../components/HomeMenu";
import { BiUserPlus, BiWorld, BiPencil, BiEdit, BiPen } from "react-icons/bi/index.js"
import React, { useState } from "react";

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
      <HomeMenu>
        <HomeItem
          type="Go to another Page"
          description='Description here...'
          icon={BiUserPlus}
          href="/another"
        />
        <HomeItem
          type="Go to another page 2"
          description='...'
          icon={BiWorld}
          href="/another2"
        />
        <HomeItem
          type="Go Test the API!"
          description='Test te api on /api/test'
          icon={BiPencil}
          onclick={
            () => {location.href = "/api/test"}
          }
        />
      </HomeMenu>
    </>
  );
}
