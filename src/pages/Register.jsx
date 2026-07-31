import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/api/register.php", {
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

      const data = await response.json();

      if (data.success) {
        alert("Account created ✅");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Server connection error ❌");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Register 📝
        </h1>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <button
            onClick={register}
            className="bg-black text-white py-3 rounded-lg"
          >
            Register
          </button>

        </div>
      </div>
    </div>
  );
}

export default Register;