import { useState } from "react";

import { apiFetch } from "../api";

function ForgotPassword() {

  const [login, setLogin] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  const sendCode = async () => {

    if (!login) {
      alert("Enter email or phone ❌");
      return;
    }


    try {
      const data = await apiFetch("/forgot_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login: login
        })
      });


      if (data.success) {

        setMessage(
          "Reset code sent ✅ Code: " + data.code
        );

      } else {

        setMessage(data.message);

      }


    } catch(error) {

      console.log(error);
      setMessage("Server error ❌");

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">


        <h1 className="text-2xl font-bold mb-6 text-center">
          Forgot Password 🔐
        </h1>


        <input

          type="text"

          placeholder="Email or phone"

          value={login}

          onChange={(e)=>setLogin(e.target.value)}

          className="w-full px-4 py-2 border rounded-lg mb-4"

        />


        <button

          onClick={sendCode}

          className="w-full bg-black text-white py-3 rounded-lg"

        >
          Send Reset Code
        </button>


        {message && (

          <p className="mt-4 text-center">
            {message}
          </p>

        )}


      </div>

    </div>

  );

}


export default ForgotPassword;