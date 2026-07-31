import { useState } from "react";

function ResetPassword(){

  const [login,setLogin] = useState("");
  const [code,setCode] = useState("");
  const [password,setPassword] = useState("");



  const resetPassword = async()=>{


    const response = await fetch(
      "http://localhost:8001/api/reset_password.php",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          login,
          code,
          password
        })
      }
    );


    const data = await response.json();


    alert(data.message);


  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">


        <h1 className="text-2xl font-bold mb-5">
          Reset Password 🔐
        </h1>


        <input
          placeholder="Email or phone"
          value={login}
          onChange={(e)=>setLogin(e.target.value)}
          className="w-full border p-2 mb-3"
        />


        <input
          placeholder="Reset code"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          className="w-full border p-2 mb-3"
        />


        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border p-2 mb-3"
        />


        <button
          onClick={resetPassword}
          className="w-full bg-black text-white p-3 rounded"
        >
          Change Password
        </button>


      </div>

    </div>

  );

}


export default ResetPassword;