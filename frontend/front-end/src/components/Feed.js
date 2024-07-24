import React from 'react'
import CreatePost from './CreatePost'
import Text from './Text'
import { useSelector } from 'react-redux'


const Feed = () => {

  const {texts} = useSelector(store=> store.text);

  return (
    <div className='w-[50%] border-gray-200'>
      <CreatePost/>

      {
        texts?.map((text)=> <Text key = {text?._id} text = {text}/>)
      }
      
    </div>
  )
}

export default Feed