import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setStatus("");

    try {
      // Store the invitation in the invites table (matches the table structure)
      const { error: inviteError } = await supabase.from("invites").insert({
        email: email.toLowerCase(),
        role: role
      });

      if (inviteError) {
        console.error("Invite storage failed:", inviteError);
        toast.error("Failed to create invitation. User may already be invited.");
        return;
      }

      toast.success(`Invitation created for ${email} with ${role} role! User can now sign up and will automatically get this role.`);
      setEmail("");
      setRole("user");
        
      // Clear status after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Invite New User</h2>

      <input
        type="email"
        placeholder="Email address"
        className="w-full mb-3 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        className="w-full mb-3 p-2 border rounded"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>

      <button
        onClick={handleInvite}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Inviting..." : "Send Invite"}
      </button>

      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
    </div>
  );
}