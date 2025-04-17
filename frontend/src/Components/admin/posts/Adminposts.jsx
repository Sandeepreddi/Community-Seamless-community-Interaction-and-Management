import React from 'react'
import Header from './../Header'
import SideNav from './../SideNav'
import Body from './Body'
import './../AdminHome.css'
import DisplayPosts from './DisplayPosts'

function Adminposts() {
  return (
    <div>
        <Header /> 
        <div className="admin-container">
            <SideNav />
            <Body />
        </div>
    </div>
  )
}

export default Adminposts
