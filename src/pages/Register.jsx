import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const register = async () => {

    if (!name || !email || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const data = await apiFetch("/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });


      if (data.success) {
        alert("Account created ✅");
        navigate("/login");
      } else {
        alert(data.message);
      }


    } catch (error) {

      console.log(error);
      alert("Server error ❌");

    }

  };


  return (
    <div style={{minHeight:'72vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="panel">
        <h1 style={{textAlign:'center', marginBottom:18, fontSize:20, fontWeight:700}}>Register 📝</h1>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />

          <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />

          <input placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <label style={{marginTop:8}}>Phone number <span style={{ color: "red" }}>*</span></label>
          <input type="text" placeholder="Enter your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div style={{position:'relative'}}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{paddingRight:40}} />
            <span onClick={()=>setShowPassword(!showPassword)} style={{position:'absolute', right:10, top:10, cursor:'pointer'}}>{showPassword ? "🙈" : "👁️"}</span>
          </div>

          <button onClick={register} className="btn btn-primary">Register</button>
        </div>
      </div>
    </div>
  );

}


export default Register;