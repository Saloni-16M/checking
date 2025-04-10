import React, { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ResortCard from "./ResortCard";
import axios from "axios";

const NGO = () => {
  const navigate = useNavigate();
  const [resorts, setResorts] = useState([]); // Pending donations
  const [acceptedDonations, setAcceptedDonations] = useState([]); // Accepted donations
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("ngoToken");
  
        // Fetch pending donations
        const pendingRes =await axios.get("http://localhost:5000/api/ngo/donations/pending");


        setResorts(pendingRes.data );
  
        // // Fetch accepted donations
        // const acceptedRes = await axios.get("http://localhost:5000/api/ngo/donations/accepted", {
        //   headers: { Authorization: Bearer ${token} },
        // });
        // setAcceptedDonations(acceptedRes.data || []);
      } catch (error) {
        console.error("Error fetching donations:", error.response?.data || error.message);        setResorts([]);
        setAcceptedDonations([]);
      } finally {
        setLoading(false);
      }
    }; const accpetDonations = async () => {
      try {
        const token = localStorage.getItem("ngoToken");
  
   const acceptedRes = await axios.get("http://localhost:5000/api/ngo/donations/accepted", {
          headers: { Authorization: `Bearer ${token}` },
         });
         setAcceptedDonations(acceptedRes.data || []);
  
      } catch (error) {
        console.error("Error fetching donations:", error.response?.data || error.message);        setResorts([]);
        setAcceptedDonations([]);
      } finally {
        setLoading(false);
      }
    };
    accpetDonations();
    fetchDonations();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F0FAF4] p-4">
      {/* Navbar Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">
          Welcome <span className="text-purple-800">[NGO Name]!</span>
          <p className="text-gray-700">Nourishing lives, reducing waste</p>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/guideline")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Guideline
          </button>
          <div className="relative">
            <FaBell className="text-xl text-black cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
              0
            </span>
          </div>
          <div className="flex items-center border border-gray-400 rounded-full px-3 py-1 bg-white">
            <input type="text" placeholder="Search" className="outline-none bg-transparent" />
            <FaSearch className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Available Food Donations Section */}
      <h2 className="mt-6 text-2xl font-bold text-center">Available Food Donations</h2>
      {loading ? (
        <p className="text-center mt-6 text-gray-600">Loading donations...</p>
      ) : resorts.length === 0 ? (
        <p className="text-center mt-6 text-gray-600">No pending donations found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {resorts.map((donation) => (
            <ResortCard
              key={donation._id}
              name={donation.resortId?.name || "Unknown Resort"}
              food={donation.foodName}
              quantity={donation.quantity}
              expiry={new Date(donation.foodMadeDate).toLocaleString()}
              location={donation.pickupAddress}
              foodType={donation.type}
              donationId={donation._id}
            />
          ))}
        </div>
      )}

      {/* Donation History Section */}
      <h2 className="mt-8 text-2xl font-bold text-center text-green-700 border-b-4 border-green-500 pb-2">
        Donation History
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-black text-center">
          <thead className="bg-gray-300">
            <tr>
              <th className="border border-black px-4 py-2">S.No.</th>
              <th className="border border-black px-4 py-2">Date</th>
              <th className="border border-black px-4 py-2">Quantity</th>
              <th className="border border-black px-4 py-2">Donor</th>
            </tr>
          </thead>
          <tbody>
            {acceptedDonations.length === 0 ? (
              <tr>
                <td colSpan="4" className="border border-black px-4 py-4 text-gray-600">
                  No accepted donations yet.
                </td>
              </tr>
            ) : (
              acceptedDonations.map((donation, index) => (
                <tr key={donation._id} className="bg-white">
                  <td className="border border-black px-4 py-2">{index + 1}</td>
                  <td className="border border-black px-4 py-2">
                    {/* Show the accepted date if status is Accepted */}
                    {donation.status === "Accepted" && donation.acceptedDate
                      ? new Date(donation.acceptedDate).toLocaleDateString()
                      : "Not Accepted Yet"}
                  </td>
                  <td className="border border-black px-4 py-2">{donation.quantity}</td>
                  <td className="border border-black px-4 py-2">
                    {donation.resortId?.name || "Unknown"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NGO;
