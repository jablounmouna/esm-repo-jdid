import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Cart({ cart, removeFromCart, increaseQuantity, decreaseQuantity }) {

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(Number(item.quantity) || 1),
    0
  );

  const getProductName = (item) => {
    if (typeof item.name === "object") {
      return item.name[i18n.language] || item.name.en;
    }

    return item.name;
  };


  return (
    <div className="site-container">

      <h1 style={{fontSize:22, fontWeight:700, marginBottom:12}}>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <h2 className="muted" style={{textAlign:'center', marginTop:24}}>Cart is empty</h2>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {cart.map((item) => (
            <div key={item.id} className="panel" style={{display:'flex', gap:12, alignItems:'center'}}>
              <img src={item.image} alt={getProductName(item)} style={{width:96, height:96, objectFit:'cover', borderRadius:8}} />

              <div style={{flex:1}}>
                <h2 style={{fontSize:16, fontWeight:700}}>{getProductName(item)}</h2>
                <p className="muted">{item.price} TND</p>

                <div style={{display:'flex', alignItems:'center', gap:8, marginTop:10}}>
                  <button onClick={() => decreaseQuantity(item.id)} className="btn btn-ghost" style={{width:36,height:36,padding:0}}>−</button>
                  <span style={{width:28, textAlign:'center', fontWeight:600}}>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} className="btn btn-ghost" style={{width:36,height:36,padding:0}}>+</button>

                  <button onClick={() => removeFromCart(item.id)} style={{marginLeft:12, color:'#c43', background:'transparent', border:0}}>Delete 🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div style={{marginTop:20, display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid var(--color-line)', paddingTop:18}}>
          <h2 style={{fontSize:18, fontWeight:700}}>Total: {total.toFixed(2)} TND</h2>
          <button onClick={() => navigate("/checkout")} className="btn btn-primary">Checkout 💳</button>
        </div>
      )}

    </div>
  );
}

export default Cart;