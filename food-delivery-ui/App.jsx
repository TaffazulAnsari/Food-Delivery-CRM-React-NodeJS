import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Phone, Wallet, Plus, Minus, ShoppingBag, Clock, X, Check, ChevronRight, Star } from 'lucide-react';

const foods = {
  pizza: { name: 'Farmhouse Pizza', price: 14, image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85', detail: 'Loaded with peppers, olives, mozzarella and our signature tomato sauce.' },
  shake: { name: 'Strawberry Shake', price: 20, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=85', detail: 'Fresh strawberries blended into a creamy chilled shake.' },
  burger: { name: 'Chicken Burger', price: 20, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=85', detail: 'Crispy chicken, lettuce and house sauce in a toasted bun.' },
  sushi: { name: 'Sushi Platter', price: 103, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=85', detail: 'A chef selection of fresh sushi rolls.' },
  salad: { name: 'Green Garden Salad', price: 50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=85', detail: 'A crisp, colourful bowl of fresh seasonal vegetables.' },
  pasta: { name: 'Creamy Pasta', price: 12.99, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=85', detail: 'Pasta tossed in a rich creamy herb sauce.' },
  dessert: { name: 'Berry Dessert', price: 8.2, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=85', detail: 'A sweet finish with fresh berries and cream.' }
};

function Button({ children, onClick, outline = false }) {
  return <button className={`primary-button ${outline ? 'outline' : ''}`} onClick={onClick}>{children}</button>;
}

function PhoneFrame({ children }) {
  return <div className="phone-frame"><div className="status"><span>9:41</span><span>▮▮ ◉ ▰</span></div>{children}</div>;
}

function AuthScreen({ onContinue }) {
  const [phone, setPhone] = useState('');
  return <PhoneFrame><div className="auth-screen">
    <button className="back" aria-label="Back"><ArrowLeft size={20}/></button>
    <h2>Sign Up to Fastor</h2><p className="muted">Let us know your mobile number and we will send you an OTP for verification.</p>
    <label className="phone-input"><strong>+91</strong><span className="orange-line">|</span><input aria-label="Mobile number" maxLength={10} inputMode="numeric" placeholder="00000 00000" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))}/></label>
    <div className="auth-bottom"><Button onClick={()=>onContinue(phone)} >Get OTP</Button><small>By clicking, I accept the <b>Terms & Conditions</b> and <b>Privacy Policy</b></small></div>
  </div></PhoneFrame>;
}

function OtpScreen({ phone, onBack, onVerify }) {
  const [otp, setOtp] = useState('');
  return <PhoneFrame><div className="auth-screen">
    <button className="back" onClick={onBack} aria-label="Back"><ArrowLeft size={20}/></button>
    <h2>6-digit code</h2><p className="muted">Please enter the code we've sent to<br/><b>+91 {phone || '12345 67890'}</b></p>
    <div className="otp-inputs">{Array.from({length:6},(_,i)=><input key={i} aria-label={`OTP digit ${i+1}`} value={otp[i]||''} maxLength={1} inputMode="numeric" onChange={e=>setOtp((otp.slice(0,i)+e.target.value.replace(/\D/g,'').slice(-1)+otp.slice(i+1)).slice(0,6))}/>)}</div>
    <p className="resend">Didn't receive a code <span>(00:30)</span></p>
    <div className="auth-bottom"><Button onClick={()=>onVerify()}>Continue</Button><small>Demo mode: any 6 digits will continue.</small></div>
  </div></PhoneFrame>;
}

function HomeScreen({ onSelect, onOpenCart }) {
  const best = ['sushi','salad','pasta','dessert'];
  return <PhoneFrame><div className="home-screen">
    <div className="location"><small>Current Locations</small><b><MapPin size={12}/> Model Town, New Delhi</b></div>
    <div className="search-row"><div className="search-box"><Search size={16}/><input placeholder="Search dishes or restaurants"/></div><button className="square-action"><Phone size={18}/></button><button className="square-action blue"><Wallet size={18}/></button></div>
    <h3>Best Seller</h3>
    <div className="best-sellers">{best.map(id=><button className="best-card" key={id} onClick={()=>onSelect(id)}><img src={foods[id].image}/><span>₹{foods[id].price}</span></button>)}</div>
    <div className="promo"><div><small>Experience our<br/>delicious new dish</small><strong>30% OFF</strong></div><img src={foods.pizza.image}/></div>
    <h3 className="section-title">Popular Items <button onClick={onOpenCart}><ShoppingBag size={17}/> Cart</button></h3>
    <div className="popular-list">
      {['shake','burger','pizza'].map(id=><button className="popular-item" key={id} onClick={()=>onSelect(id)}><img src={foods[id].image}/><span className="popular-copy"><b>{foods[id].name}</b><small><Clock size={11}/> 20 min · 2 items</small><span className="mini-actions"><em>Cancel Order</em><em>Track Driver</em></span></span><strong>₹{foods[id].price.toFixed(2)}</strong></button>)}
    </div>
    <nav className="bottom-nav"><span className="active"><ShoppingBag size={18}/>Home</span><span><Search size={18}/>Explore</span><span onClick={onOpenCart}><Wallet size={18}/>Cart</span><span><Star size={18}/>Profile</span></nav>
  </div></PhoneFrame>;
}

function ProductScreen({ id, onBack, onAdd }) {
  const item = foods[id] || foods.pizza;
  const [quantity, setQuantity] = useState(3);
  const [portion, setPortion] = useState('Jumbo (12 Slices)');
  const portions = [['Personal (4 Slices)',0],['Medium (8 Slices)',3],['Family (10 Slices)',6],['Jumbo (12 Slices)',10]];
  return <PhoneFrame><div className="product-screen">
    <button className="product-back" onClick={onBack}><ArrowLeft size={19}/><span>Item details</span></button>
    <img className="hero-food" src={item.image} alt={item.name}/>
    <div className="price-row"><strong>₹{(item.price*quantity).toFixed(2)}</strong><div className="quantity"><button onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus size={13}/></button><b>{quantity}</b><button onClick={()=>setQuantity(quantity+1)}><Plus size={13}/></button></div></div>
    <p className="description">{item.detail}</p>
    <h3>Personal portion</h3><p className="portion-hint">Choose your portion size</p>
    <div className="portions">{portions.map(([name,extra])=><button key={name} className={portion===name?'selected':''} onClick={()=>setPortion(name)}><span>{name}</span><i></i><small>₹{(item.price+extra).toFixed(2)}</small><b>{portion===name?'◉':'○'}</b></button>)}</div>
    <div className="product-footer"><Button onClick={()=>onAdd(item, quantity, portion)}>Add to cart · ₹{(item.price*quantity).toFixed(2)}</Button></div>
  </div></PhoneFrame>;
}

function CartScreen({ cart, onBack, onRemove }) {
  const total = cart.reduce((sum,x)=>sum+x.price*x.quantity,0);
  return <PhoneFrame><div className="cart-screen"><button className="back" onClick={onBack}><ArrowLeft size={20}/></button><h2>Your cart</h2>{cart.length===0?<div className="empty-cart"><ShoppingBag size={42}/><h3>Your cart is empty</h3><p className="muted">Add something delicious to get started.</p></div>:<>{cart.map((item,i)=><div className="cart-row" key={i}><img src={item.image}/><div><b>{item.name}</b><small>{item.portion} · Qty {item.quantity}</small><strong>₹{(item.price*item.quantity).toFixed(2)}</strong></div><button onClick={()=>onRemove(i)}><X size={16}/></button></div>)}<div className="cart-total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div><Button onClick={()=>alert('Order placed! This is a UI demo.')}>Place order</Button></>}</div></PhoneFrame>;
}

export default function App() {
  const [screen, setScreen] = useState('signup');
  const [phone, setPhone] = useState('');
  const [selected, setSelected] = useState('pizza');
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState('');
  function continuePhone(value) {
    if (value.length !== 10) { setNotice('Please enter a valid 10-digit mobile number.'); return; }
    setNotice(''); setPhone(value); setScreen('otp');
  }
  function verify() { setScreen('home'); }
  function addToCart(item, quantity, portion) {
    setCart(prev=>[...prev,{...item,quantity,portion}]); setScreen('cart');
  }
  return <main className="app-shell">
    <header className="site-header"><div className="brand-mark">f</div><div><strong>Fastor</strong><small>Food delivery UI</small></div><span className="prototype-tag">React prototype</span></header>
    <section className="preview-area">
      <div className="screen-label"><span>01</span><b>Sign up</b></div>
      <div className="screen-label"><span>02</span><b>OTP verification</b></div>
      <div className="screen-label"><span>03</span><b>Discover food</b></div>
      <div className="screen-label"><span>04</span><b>Item details</b></div>
      <div className="preview-grid">
        <div className="preview-card">{screen==='signup'?<AuthScreen onContinue={continuePhone}/>:<AuthScreen onContinue={continuePhone}/>}</div>
        <div className="preview-card">{screen==='otp'?<OtpScreen phone={phone} onBack={()=>setScreen('signup')} onVerify={verify}/>:<OtpScreen phone={phone} onBack={()=>setScreen('signup')} onVerify={verify}/>}</div>
        <div className="preview-card"><HomeScreen onSelect={id=>{setSelected(id);setScreen('product')}} onOpenCart={()=>setScreen('cart')}/></div>
        <div className="preview-card">{screen==='cart'?<CartScreen cart={cart} onBack={()=>setScreen('home')} onRemove={i=>setCart(c=>c.filter((_,idx)=>idx!==i))}/>:<ProductScreen id={selected} onBack={()=>setScreen('home')} onAdd={addToCart}/>}</div>
      </div>
      <div className="mobile-controls"><span>{notice}</span><button onClick={()=>setScreen('signup')}>Signup</button><button onClick={()=>setScreen('otp')}>OTP</button><button onClick={()=>setScreen('home')}>Home</button><button onClick={()=>setScreen('product')}>Product</button><button onClick={()=>setScreen('cart')}>Cart ({cart.length})</button></div>
    </section>
    <footer>Built with React + Vite · Responsive mobile-first UI · Demo interactions only</footer>
  </main>;
}
