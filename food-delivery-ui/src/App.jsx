
import React, { useEffect, useState } from "react";
import "./styles.css";

const foods = [
  { id: 1, name: "Farmhouse Pizza", category: "Pizza", price: 249, emoji: "🍕", desc: "Cheesy pizza with fresh vegetables" },
  { id: 2, name: "Classic Burger", category: "Burger", price: 179, emoji: "🍔", desc: "Crispy patty with fresh lettuce" },
  { id: 3, name: "French Fries", category: "Snacks", price: 99, emoji: "🍟", desc: "Golden and crispy potato fries" },
  { id: 4, name: "Alfredo Pasta", category: "Pasta", price: 219, emoji: "🍝", desc: "Creamy white sauce pasta" },
  { id: 5, name: "Strawberry Shake", category: "Drinks", price: 120, emoji: "🥤", desc: "Refreshing strawberry milkshake" },
  { id: 6, name: "Fresh Salad", category: "Healthy", price: 149, emoji: "🥗", desc: "Fresh and healthy garden salad" },
  { id: 7, name: "Chocolate Cake", category: "Dessert", price: 159, emoji: "🍰", desc: "Rich chocolate dessert" },
  { id: 8, name: "Sushi Platter", category: "Asian", price: 299, emoji: "🍣", desc: "A delicious sushi platter" }
];

const initialEnquiries = [
  { id: 101, name: "Rahul Sharma", email: "rahul@example.com", subject: "Bulk food order", status: "Available", owner: "" },
  { id: 102, name: "Priya Singh", email: "priya@example.com", subject: "Catering enquiry", status: "Available", owner: "" },
  { id: 103, name: "Aman Kumar", email: "aman@example.com", subject: "Delivery partnership", status: "Available", owner: "" },
  { id: 104, name: "Neha Verma", email: "neha@example.com", subject: "Restaurant partnership", status: "Available", owner: "" }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [user, setUser] = useState(() => readStorage("foodCrmUser", null));
  const [accounts, setAccounts] = useState(() => readStorage("foodCrmAccounts", []));
  const [orders, setOrders] = useState(() => readStorage("foodCrmOrders", []));
  const [enquiries, setEnquiries] = useState(() => readStorage("foodCrmEnquiries", initialEnquiries));

  const [authMode, setAuthMode] = useState("login");
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  useEffect(() => localStorage.setItem("foodCrmAccounts", JSON.stringify(accounts)), [accounts]);
  useEffect(() => localStorage.setItem("foodCrmOrders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("foodCrmEnquiries", JSON.stringify(enquiries)), [enquiries]);

  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";

  const categories = ["All", ...new Set(foods.map(food => food.category))];

  const filteredFoods = foods.filter(food => {
    const matchesCategory = category === "All" || food.category === category;
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItems = foods.filter(food => (cart[food.id] || 0) > 0);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = cartItems.reduce((sum, food) => sum + food.price * cart[food.id], 0);

  const myOrders = orders.filter(order => order.email === user?.email);
  const myLeads = enquiries.filter(item => item.owner === user?.email);
  const availableEnquiries = enquiries.filter(item => item.status === "Available");

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function authenticate(event) {
    event.preventDefault();
    setNotice("");

    const email = form.email.trim().toLowerCase();

    if (authMode === "signup") {
      const alreadyExists = accounts.some(account => account.email === email);

      if (alreadyExists) {
        setNotice("This email is already registered. Please log in.");
        return;
      }

      const newAccount = {
        name: form.name.trim(),
        email,
        password: form.password,
        role: form.role
      };

      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      enterApp(newAccount);
      return;
    }

    const account = accounts.find(
      item => item.email === email && item.password === form.password
    );

    if (!account) {
      setNotice("Account not found or password is incorrect. Sign up first if you are new.");
      return;
    }

    enterApp(account);
  }

  function enterApp(account) {
    const session = {
      name: account.name,
      email: account.email,
      role: account.role
    };

    setUser(session);
    localStorage.setItem("foodCrmUser", JSON.stringify(session));
    setPage(account.role === "customer" ? "home" : "dashboard");
    setCart({});
    setForm({ name: "", email: "", password: "", role: "customer" });
    setNotice("");
  }

  function logout() {
    setUser(null);
    setPage("home");
    setCart({});
    localStorage.removeItem("foodCrmUser");
  }

  function changeQuantity(id, amount) {
    setCart(current => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + amount)
    }));
  }

  function checkout() {
    if (!cartItems.length) {
      setNotice("Your cart is empty. Add some food first.");
      return;
    }

    const order = {
      id: `FD${Date.now().toString().slice(-8)}`,
      email: user.email,
      customer: user.name,
      items: cartItems.map(food => ({
        name: food.name,
        price: food.price,
        quantity: cart[food.id]
      })),
      total,
      status: "Order placed",
      date: new Date().toLocaleString()
    };

    setOrders(current => [order, ...current]);
    setCart({});
    setNotice(`Order ${order.id} placed successfully!`);
    setPage("orders");
  }

  function claimEnquiry(id) {
    setEnquiries(current => current.map(item =>
      item.id === id
        ? { ...item, status: "Claimed", owner: user.email }
        : item
    ));
  }

  function createEnquiry(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const item = {
      id: Date.now(),
      name: data.get("customerName"),
      email: data.get("customerEmail"),
      subject: data.get("subject"),
      status: "Available",
      owner: ""
    };

    setEnquiries(current => [item, ...current]);
    event.currentTarget.reset();
    setNotice("Enquiry added successfully.");
  }

  if (!user) {
    return (
      <div className="auth-layout">
        <section className="auth-banner">
          <div className="brand brand-light"><span className="brand-icon">🍽️</span> Food<span>CRM</span></div>
          <div className="banner-copy">
            <span className="eyebrow">YOUR FOOD. YOUR BUSINESS.</span>
            <h1>Good food.<br />Great experiences.</h1>
            <p>Order your favourites or manage your business, all from one place.</p>
            <div className="banner-food">🍕 🍔 🍟 🥤</div>
            <div className="banner-points">
              <span>✓ Easy ordering</span>
              <span>✓ Smart CRM</span>
              <span>✓ One workspace</span>
            </div>
          </div>
          <p className="banner-footer">Food Delivery + Customer Relationship Management</p>
        </section>

        <section className="auth-area">
          <form className="auth-card" onSubmit={authenticate}>
            <div className="mobile-brand brand"><span className="brand-icon">🍽️</span> Food<span>CRM</span></div>
            <span className="eyebrow">WELCOME TO FOODCRM</span>
            <h2>{authMode === "login" ? "Welcome back!" : "Create your account"}</h2>
            <p className="muted">
              {authMode === "login" ? "Enter your details to continue." : "Join us to get started."}
            </p>

            {authMode === "signup" && (
              <>
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" value={form.name} onChange={updateForm} placeholder="Your full name" required />
              </>
            )}

            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={updateForm} placeholder="you@example.com" required />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" minLength="4" value={form.password} onChange={updateForm} placeholder="Enter password" required />

            {authMode === "signup" && (
              <>
                <label htmlFor="role">Choose workspace</label>
                <select id="role" name="role" value={form.role} onChange={updateForm}>
                  <option value="customer">Food Delivery Customer</option>
                  <option value="counselor">CRM Counselor</option>
                  <option value="admin">CRM Admin (Demo only)</option>
                </select>
                <p className="field-hint">Demo only: roles are selected locally and are not securely authorized by a server.</p>
              </>
            )}

            {notice && <p className="notice">{notice}</p>}

            <button className="btn btn-primary btn-block" type="submit">
              {authMode === "login" ? "Login to account →" : "Create account →"}
            </button>

            <p className="auth-switch">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button type="button" className="text-button" onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setNotice(""); }}>
                {authMode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
            <p className="demo-note">Frontend demo · Data is stored in this browser only.</p>
          </form>
        </section>
      </div>
    );
  }

  const customerNavigation = [
    { id: "home", icon: "⌂", label: "Explore Food" },
    { id: "cart", icon: "🛒", label: `My Cart (${cartCount})` },
    { id: "orders", icon: "▣", label: "My Orders" }
  ];

  const crmNavigation = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "enquiries", icon: "☷", label: "Enquiries" },
    { id: "leads", icon: "♙", label: "My Leads" }
  ];

  const navigation = isCustomer ? customerNavigation : crmNavigation;

  const titles = {
    home: ["Discover delicious food", "Find something delicious for every craving."],
    cart: ["Your shopping cart", "Review your items before checkout."],
    orders: ["My orders", "Keep track of your recent food orders."],
    dashboard: ["CRM Dashboard", "Your business activity at a glance."],
    enquiries: ["Customer enquiries", "Manage and claim available enquiries."],
    leads: ["My leads", "Follow up on enquiries assigned to you."]
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#top" className="brand" onClick={event => { event.preventDefault(); setPage(isCustomer ? "home" : "dashboard"); }}>
          <span className="brand-icon">🍽️</span> Food<span>CRM</span>
        </a>

        <div className="workspace-card">
          <span className="workspace-icon">{isCustomer ? "🛍️" : "📊"}</span>
          <div>
            <b>{isCustomer ? "Food Delivery" : "CRM Workspace"}</b>
            <small>{user.role.toUpperCase()}</small>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>
        <nav className="nav-list">
          {navigation.map(item => (
            <button key={item.id} className={`nav-link ${page === item.id ? "selected" : ""}`} onClick={() => { setPage(item.id); setNotice(""); }}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "cart" && cartCount > 0 && <span className="nav-count">{cartCount}</span>}
            </button>
          ))}
        </nav>

        {isCustomer && (
          <div className="sidebar-promo">
            <span>🍕</span>
            <b>Feeling hungry?</b>
            <p>Your next favourite meal is just a few clicks away.</p>
            <button onClick={() => setPage("home")}>Explore menu →</button>
          </div>
        )}

        <div className="sidebar-user">
          <div className="avatar">{(user.name || user.email).charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <b>{user.name || "User"}</b>
            <small>{user.email}</small>
          </div>
          <button className="logout-button" title="Logout" onClick={logout}>↪</button>
        </div>
      </aside>

      <main className="main-area" id="top">
        <header className="topbar">
          <div className="mobile-brand brand"><span className="brand-icon">🍽️</span> Food<span>CRM</span></div>
          <div className="breadcrumb">Workspace <span>/</span> <b>{titles[page]?.[0] || "Dashboard"}</b></div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            <span className="online-label">Demo workspace</span>
            {isCustomer && <button className="btn btn-primary top-cart" onClick={() => setPage("cart")}>🛒 Cart ({cartCount})</button>}
            <div className="avatar top-avatar">{(user.name || user.email).charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice notice-success">
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          <div className="page-heading">
            <div>
              <span className="eyebrow">{isCustomer ? "FOOD DELIVERY" : "CUSTOMER MANAGEMENT"}</span>
              <h1>{titles[page]?.[0] || "Dashboard"}</h1>
              <p>{titles[page]?.[1] || ""}</p>
            </div>
            {isCustomer && page === "home" && (
              <div className="search-box">
                <span>⌕</span>
                <input aria-label="Search food" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search dishes..." />
              </div>
            )}
          </div>

          {isCustomer && page === "home" && (
            <>
              <section className="food-hero">
                <div className="hero-copy">
                  <span className="hero-tag">✨ TODAY'S SPECIAL</span>
                  <h2>Good food,<br /><span>good mood!</span></h2>
                  <p>Delicious meals made fresh and delivered with love.</p>
                  <button className="btn btn-white" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>Explore menu <span>→</span></button>
                  <small>Fresh ingredients · Great taste · Happy you</small>
                </div>
                <div className="hero-art">
                  <div className="hero-circle"></div>
                  <span className="hero-emoji">🍕</span>
                  <span className="floating-food food-one">🍟</span>
                  <span className="floating-food food-two">🍔</span>
                  <span className="floating-food food-three">🥤</span>
                </div>
              </section>

              <div className="section-header" id="menu">
                <div><h2>Popular dishes</h2><p>Our most-loved picks, just for you.</p></div>
                <span className="item-count">{filteredFoods.length} items</span>
              </div>

              <div className="category-list">
                {categories.map(item => (
                  <button key={item} className={`category-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>

              <div className="food-grid">
                {filteredFoods.map(food => (
                  <article className="food-card" key={food.id}>
                    <div className={`food-art food-color-${food.id}`}>
                      <span className="food-badge">★ Popular</span>
                      <span className="food-emoji">{food.emoji}</span>
                    </div>
                    <div className="food-card-body">
                      <span className="food-category">{food.category}</span>
                      <h3>{food.name}</h3>
                      <p>{food.desc}</p>
                      <div className="food-card-bottom">
                        <div><small>PRICE</small><b>₹{food.price}</b></div>
                        <button className="add-button" onClick={() => changeQuantity(food.id, 1)} aria-label={`Add ${food.name} to cart`}>
                          {cart[food.id] ? <><span>−</span> {cart[food.id]} <span onClick={event => { event.stopPropagation(); changeQuantity(food.id, 1); }}>+</span></> : <><span>＋</span> Add</>}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredFoods.length === 0 && <div className="empty-state"><span>🔎</span><h3>No dishes found</h3><p>Try another search or category.</p></div>}
            </>
          )}

          {isCustomer && page === "cart" && (
            <section className="panel">
              <div className="panel-heading"><div><h2>Cart items</h2><p>{cartCount} item(s) in your cart</p></div><button className="btn btn-outline" onClick={() => setPage("home")}>＋ Add more food</button></div>
              {cartItems.length === 0 ? (
                <div className="empty-state"><span>🛒</span><h3>Your cart is empty</h3><p>Explore our menu and add your favourite dishes.</p><button className="btn btn-primary" onClick={() => setPage("home")}>Explore menu</button></div>
              ) : (
                <>
                  <div className="cart-list">
                    {cartItems.map(food => (
                      <div className="cart-item" key={food.id}>
                        <div className={`cart-food-icon food-color-${food.id}`}>{food.emoji}</div>
                        <div className="cart-food-details"><b>{food.name}</b><small>{food.category}</small><span>₹{food.price} each</span></div>
                        <div className="quantity-control"><button onClick={() => changeQuantity(food.id, -1)}>−</button><b>{cart[food.id]}</b><button onClick={() => changeQuantity(food.id, 1)}>+</button></div>
                        <b className="cart-line-total">₹{food.price * cart[food.id]}</b>
                      </div>
                    ))}
                  </div>
                  <div className="cart-summary"><div><span>Subtotal</span><b>₹{total}</b></div><div><span>Delivery</span><b className="free-label">Free</b></div><div className="summary-total"><span>Total</span><b>₹{total}</b></div><button className="btn btn-primary btn-block" onClick={checkout}>Place demo order →</button><p className="field-hint">Demo checkout only. No payment will be collected.</p></div>
                </>
              )}
            </section>
          )}

          {isCustomer && page === "orders" && (
            <section className="panel">
              <div className="panel-heading"><div><h2>Order history</h2><p>Your orders placed in this browser.</p></div><span className="item-count">{myOrders.length} orders</span></div>
              {myOrders.length === 0 ? <div className="empty-state"><span>📦</span><h3>No orders yet</h3><p>Your placed orders will appear here.</p><button className="btn btn-primary" onClick={() => setPage("home")}>Start ordering</button></div> : (
                <div className="orders-list">{myOrders.map(order => (
                  <article className="order-card" key={order.id}>
                    <div className="order-top"><div><span className="order-id">{order.id}</span><p>{order.date}</p></div><span className="pill pill-green">{order.status}</span></div>
                    <div className="order-products">{order.items.map(item => <span key={item.name}>{item.name} × {item.quantity}</span>)}</div>
                    <div className="order-bottom"><span>Total paid (demo)</span><b>₹{order.total}</b></div>
                  </article>
                ))}</div>
              )}
            </section>
          )}

          {!isCustomer && page === "dashboard" && (
            <>
              <section className="welcome-banner"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>Hello, {user.name || "there"}! 👋</h2><p>Here is an overview of your CRM activity.</p></div><div className="welcome-emoji">📈</div></section>
              <div className="stats-grid">
                <article className="stat-card"><div className="stat-icon orange-icon">☷</div><span>Available enquiries</span><h2>{isAdmin ? availableEnquiries.length : availableEnquiries.length}</h2><small>Waiting to be claimed</small></article>
                <article className="stat-card"><div className="stat-icon green-icon">✓</div><span>My leads</span><h2>{myLeads.length}</h2><small>Assigned to your account</small></article>
                <article className="stat-card"><div className="stat-icon purple-icon">♙</div><span>Workspace role</span><h2 className="role-stat">{user.role === "admin" ? "Admin" : "Counselor"}</h2><small>Current demo role</small></article>
                <article className="stat-card"><div className="stat-icon blue-icon">▣</div><span>Total enquiries</span><h2>{enquiries.length}</h2><small>Across this browser</small></article>
              </div>
              <section className="panel">
                <div className="panel-heading"><div><h2>Recent enquiries</h2><p>Latest customer enquiries in this demo.</p></div><button className="btn btn-outline" onClick={() => setPage("enquiries")}>View all →</button></div>
                <EnquiryTable items={enquiries.slice(0, 4)} user={user} onClaim={claimEnquiry} />
              </section>
            </>
          )}

          {!isCustomer && page === "enquiries" && (
            <>
              {isAdmin && <section className="panel create-enquiry-panel"><div className="panel-heading"><div><h2>Add enquiry</h2><p>Create a sample customer enquiry.</p></div></div><form className="enquiry-form" onSubmit={createEnquiry}><input name="customerName" placeholder="Customer name" required /><input name="customerEmail" type="email" placeholder="Customer email" required /><input name="subject" placeholder="Enquiry subject" required /><button className="btn btn-primary" type="submit">＋ Add enquiry</button></form></section>}
              <section className="panel"><div className="panel-heading"><div><h2>All enquiries</h2><p>Claim an available enquiry to add it to your leads.</p></div><span className="item-count">{isAdmin ? enquiries.length : availableEnquiries.length} records</span></div><EnquiryTable items={isAdmin ? enquiries : enquiries.filter(item => item.status === "Available" || item.owner === user.email)} user={user} onClaim={claimEnquiry} /></section>
            </>
          )}

          {!isCustomer && page === "leads" && (
            <section className="panel"><div className="panel-heading"><div><h2>My assigned leads</h2><p>Enquiries you have claimed using this account.</p></div><span className="item-count">{myLeads.length} leads</span></div>{myLeads.length === 0 ? <div className="empty-state"><span>📋</span><h3>No leads assigned</h3><p>Visit Enquiries and claim an available lead.</p><button className="btn btn-primary" onClick={() => setPage("enquiries")}>Browse enquiries</button></div> : <EnquiryTable items={myLeads} user={user} onClaim={claimEnquiry} />}</section>
          )}

          <footer className="page-footer"><span>© 2026 FoodCRM Demo</span><span>Food Delivery <i>•</i> CRM Workspace</span></footer>
        </div>
      </main>
    </div>
  );
}

function EnquiryTable({ items, user, onClaim }) {
  if (!items.length) {
    return <div className="empty-state"><span>📭</span><h3>No enquiries found</h3><p>There are no enquiries to show right now.</p></div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Customer</th><th>Enquiry</th><th>Status</th><th>Assigned to</th><th>Action</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td><div className="table-customer"><div className="avatar">{item.name.charAt(0).toUpperCase()}</div><div><b>{item.name}</b><small>{item.email}</small></div></div></td>
              <td>{item.subject}</td>
              <td><span className={`pill ${item.status === "Available" ? "pill-orange" : "pill-green"}`}>{item.status}</span></td>
              <td>{item.owner ? (item.owner === user.email ? "You" : item.owner) : "—"}</td>
              <td>{item.status === "Available" ? <button className="table-action" onClick={() => onClaim(item.id)}>Claim lead →</button> : <span className="muted">Assigned</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
