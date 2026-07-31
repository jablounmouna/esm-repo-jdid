import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
function Login() {

  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    console.log("LOGIN START");
    console.log("LOGIN:", loginInput);
    console.log("PASSWORD:", password);

    if (!loginInput || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8001/api/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: loginInput,
            password: password
          }),
        }
      );


      const text = await response.text();

      console.log("RAW RESPONSE:", text);


      const data = JSON.parse(text);


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

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">


        <h1 className="text-2xl font-bold text-center mb-6">
          Login 🔐
        </h1>


        <div className="flex flex-col gap-4">


          <input
            type="text"
            placeholder="Email or phone"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />


          <button
  onClick={login}
  className="bg-black text-white py-3 rounded-lg"
>
  Login
</button>


<Link
  to="/forgot-password"
  className="text-center text-blue-600 mt-3"
>
  Forgot password?
</Link>

        </div>

      </div>

    </div>

  );

}


export default Login;