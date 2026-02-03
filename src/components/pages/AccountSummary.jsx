import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiCamera } from "react-icons/fi";

const AccountSummary = () => {
  const [user, setUser] = useState({
    profilePic: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    officeName: "",
    newPassword: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/auth/account-summary", { withCredentials: true });
        if (isMounted && data) {
          setUser((prevUser) => ({
            ...prevUser,
            profilePic: data.profilePic || "",
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            dob: data.dob ? new Date(data.dob).toLocaleDateString("en-GB") : "",
            address: data.address || "",
            officeName: data.officeName || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const { data } = await api.post("/api/auth/profile-pic", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prevUser) => ({ ...prevUser, profilePic: data.profilePic || "" }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updatedUser = { ...user };
      if (updatedUser.dob) {
        const [day, month, year] = updatedUser.dob.split("/");
        updatedUser.dob = `${year}-${month}-${day}`;
      }
      if (!updatedUser.newPassword) delete updatedUser.newPassword;
      await api.put("/api/auth/profile", updatedUser, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Profile</h2>

      <div className="relative flex flex-col items-center mb-6">
        <label htmlFor="profilePic" className="cursor-pointer relative">
          <img
            src={preview || user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow-md"
          />
          <div className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full shadow-lg">
            <FiCamera className="text-white" size={20} />
          </div>
        </label>
        <input type="file" id="profilePic" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "phone", "dob", "address", "officeName"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-gray-600">{field.replace(/([A-Z])/g, " $1").trim()}</label>
            <input
              type="text"
              name={field}
              value={user[field] || ""}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-600">Email (Cannot be changed)</label>
          <input
            type="email"
            name="email"
            value={user.email || ""}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600">Change Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AccountSummary;