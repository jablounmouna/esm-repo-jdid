import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api";

function Login() {

  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false); 
  const login = async () => {

    console.log("LOGIN START");
    console.log("LOGIN:", loginInput);
    console.log("PASSWORD:", password);

    if (!loginInput || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const data = await apiFetch("/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: loginInput,
          password: password,
        }),
      });

      if (data.success) {

        console.log("LOGIN SUCCESS");

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        console.log(
          "STORED:",
          localStorage.getItem("user")
        );


        alert("Login success ✅");

        navigate("/");


      } else {

        console.log(
          "LOGIN FAILED:",
          data.message
        );

        alert(data.message);

      }


    } catch(error) {

      console.log("ERROR:", error);

      alert("Server error ❌");

    }

  };


  return (
    <div style={{minHeight:'72vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="panel">
        <h1 style={{textAlign:'center', marginBottom:18, fontSize:20, fontWeight:700}}>Login 🔐</h1>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <input
            type="text"
            placeholder="Email or phone"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
          />

          <div style={{position:'relative'}}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{paddingRight:40}}
            />

            <span onClick={() => setShowPassword(!showPassword)} style={{position:'absolute', right:10, top:10, cursor:'pointer'}}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button onClick={login} className="btn btn-primary">Login</button>

          <Link to="/forgot-password" className="muted" style={{textAlign:'center', display:'block'}}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );

}


export default Login;