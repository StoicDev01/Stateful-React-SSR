import HomeItem from "../components/HomeItem"
import HomeMenu from "../components/HomeMenu";
import { BiUserPlus, BiWorld, BiPencil } from "react-icons/bi/index.js"
import React from "react";

export default function Home(){
  
  return (
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
      </HomeMenu>
  );
}
