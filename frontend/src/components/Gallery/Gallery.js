import React, { useState, useEffect, useRef, useCallback } from 'react';
import { galleryAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './Gallery.css';
const DEMO = [
  { _id:'d1', mediaUrl:'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500&q=70', mediaType:'image' },
  { _id:'d2', mediaUrl:'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=500&q=70',   mediaType:'image' },
  { _id:'d3', mediaUrl:'https://images.unsplash.com/photo-1596550944968-6a2ad5a7b0f4?w=500&q=70', mediaType:'image' },
  { _id:'d4', mediaUrl:'https://images.unsplash.com/photo-1601460085826-4c5a39a8c7d6?w=500&q=70', mediaType:'image' },
  { _id:'d5', mediaUrl:'https://images.unsplash.com/photo-1621181483028-5f8b4a3d58c8?w=500&q=70', mediaType:'image' },
];
export default function Gallery() {
  const [items, setItems] = useState(DEMO);
  const [uploading, setUploading] = useState(false);
  const [lbIndex,  setLbIndex]  = useState(-1);
  const fileRef = useRef();
  useEffect(() => { galleryAPI.getAll().then(r => { if (r.data?.data?.length > 0) setItems(r.data.data); }).catch(() => {}); }, []);

  const visibleItems = items.slice(0, 5);
  const lbPrev = useCallback(() => setLbIndex(i => (i - 1 + visibleItems.length) % visibleItems.length), [visibleItems.length]);
  const lbNext = useCallback(() => setLbIndex(i => (i + 1) % visibleItems.length), [visibleItems.length]);
  const lbClose = useCallback(() => setLbIndex(-1), []);

  useEffect(() => {
    if (lbIndex < 0) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') lbPrev();
      else if (e.key === 'ArrowRight') lbNext();
      else if (e.key === 'Escape') lbClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lbIndex, lbPrev, lbNext, lbClose]);
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return; setUploading(true);
    for (const file of files) {
      const fd = new FormData(); fd.append('media', file);
      try { const r = await galleryAPI.upload(fd); setItems(p => [...p, r.data.data]); toast.success('Uploaded!'); }
      catch { const url = URL.createObjectURL(file); setItems(p => [...p, { _id: Date.now().toString(), mediaUrl: url, mediaType: file.type.startsWith('video') ? 'video' : 'image' }]); toast('Saved locally', { icon: 'i' }); }
    }
    setUploading(false); e.target.value = '';
  };
  return (
    <section className="section gallery-section" id="gallery">
      <div className="gallery-layout container">
        <div className="gallery-text">
          <span className="section-tag">Our Gallery</span>
          <h2 className="section-title">It is a hobby that can last you a lifetime</h2>
          <p className="section-sub">An aquarium is not just decoration — it is a lifelong hobby. From the calming beauty of fish to the joy of creating a thriving underwater world, it grows with you and brings peace and fascination for decades.</p>
          <button className="btn-primary gallery-discover" onClick={() => { const el = document.getElementById('contact'); if(el) el.scrollIntoView({behavior:'smooth'}); }}>Contact Us</button>
        </div>
        <div className="gallery-grid">
          {visibleItems.map((item,i) => (
            <div className="g-cell" key={item._id} onClick={() => setLbIndex(i)}>
              {item.mediaType === 'video' ? <video src={item.mediaUrl} muted loop autoPlay playsInline /> : <img src={item.mediaUrl} alt={'Aquarium '+(i+1)} loading="lazy" />}
              <div className="g-overlay"><i className="fas fa-expand-alt"></i></div>
            </div>
          ))}
          <div className={"g-cell g-add"+(uploading?' uploading':'')} onClick={() => !uploading && fileRef.current.click()}>
            {uploading ? <><i className="fas fa-spinner fa-spin"></i><span>Uploading...</span></> : <><i className="fas fa-plus-circle"></i><span>Add Photo / Video</span></>}
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{display:'none'}} onChange={handleUpload} />
          </div>
        </div>
      </div>
      {lbIndex >= 0 && lbIndex < visibleItems.length && (
        <div className="lightbox" onClick={lbClose}>
          <button className="lb-close" onClick={lbClose}><i className="fas fa-times"></i></button>
          <button className="lb-arrow lb-prev" onClick={e => { e.stopPropagation(); lbPrev(); }}><i className="fas fa-chevron-left"></i></button>
          <div className="lb-content" onClick={e => e.stopPropagation()}>
            {visibleItems[lbIndex].mediaType === 'video'
              ? <video src={visibleItems[lbIndex].mediaUrl} controls autoPlay />
              : <img src={visibleItems[lbIndex].mediaUrl} alt="Gallery" />
            }
          </div>
          <button className="lb-arrow lb-next" onClick={e => { e.stopPropagation(); lbNext(); }}><i className="fas fa-chevron-right"></i></button>
          <div className="lb-counter">{lbIndex + 1} / {visibleItems.length}</div>
        </div>
      )}
    </section>
  );
}
