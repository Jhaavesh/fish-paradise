import React, { useState, useEffect } from 'react';
import './ScrollTop.css';
export default function ScrollTop() {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{ const fn=()=>setVisible(window.scrollY>400); window.addEventListener('scroll',fn); return()=>window.removeEventListener('scroll',fn); },[]);
  return (<button className={"scroll-top"+(visible?' visible':'')} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top"><i className="fas fa-arrow-up"></i></button>);
}
