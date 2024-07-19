import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ArtistProfile from './components/ArtistProfile';
import ArtListing from './components/ArtListing';
import ArtDetails from './components/ArtDetails';
import UploadArt from './components/UploadArt';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Wishlist from './components/Wishlist';
import Reviews from './components/Reviews';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import Search from './components/Search';
import Category from './components/Category';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import cartIcon from './icons/cart-icon.png';
import messageIcon from './icons/message-icon.png';
import notificationIcon from './icons/notification-icon.png';
import plusIcon from './icons/plus-icon.png';
import CartPopup from './components/CartPopUp';

function App() {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);

  return (
    <NotificationProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/profile/:id" component={ArtistProfile} />
              <Route path="/art/:id" component={ArtDetails} />
              <Route path="/upload" component={UploadArt} />
              <Route path="/art-listing" component={ArtListing} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/cart" component={CartPopup} />
              <Route path="/user-profile" component={UserProfile} />
              <Route path="/edit-profile" component={EditProfile} />
              <Route path="/wishlist" component={Wishlist} />
              <Route path="/reviews" component={Reviews} />
              <Route path="/messages" component={Messages} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/search" component={Search} />
              <Route path="/category/:category" component={Category} />
            </Switch>
            <Footer />
            <div className="icons">
              <div className="icon" onClick={() => setShowCart(!showCart)}>
                <img src={cartIcon} alt="Cart" />
              </div>
              <div className="icon" onClick={() => setShowMessages(!showMessages)}>
                <img src={messageIcon} alt="Messages" />
              </div>
              <div className="icon" onClick={() => setShowNotifications(!showNotifications)}>
                <img src={notificationIcon} alt="Notifications" />
              </div>
              <div className="icon">
                <img src={plusIcon} alt="Upload Art" />
              </div>
            </div>
            {showCart && <Cart />}
            {showMessages && <Messages />}
            {showNotifications && <Notifications />}
          </Router>
        </CartProvider>
      </WishlistProvider>
    </NotificationProvider>
  );
}

export default App;
