"use client";
import { useEffect,useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
    const { data: session, status } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    lifestyle: "",
    bloodGroup: "",
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Registration successful!");
        setIsRegistering(false);
      } else {
        alert("Registration failed!");
      }
    } else {
      const res = await signIn("user-credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/"); 
      } else {
        alert("Login failed!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? "Register" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input name="age" placeholder="Age" type="number" onChange={handleChange} className="w-full p-2 border rounded" />
              <select name="gender" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input name="lifestyle" placeholder="Lifestyle (e.g. Active, Sedentary)" onChange={handleChange} className="w-full p-2 border rounded" />
              <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="w-full p-2 border rounded" />
            </>
          )}

          <input name="email" placeholder="Email" type="email" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full p-2 border rounded" required />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
