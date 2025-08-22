import { useEffect, useState } from 'react';
import { getUserLeaves } from '../api/leaveApi';
import { getUser } from '../utils/getUser';
import { useNavigate } from 'react-router-dom';
import LeaveRequestModal from '../components/RequestModal'; 

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const { data } = await getUserLeaves(user._id);
        setLeaves(data.leaves);
      } catch (err) {
        console.error('Error fetching leaves:', err);
      }
    };

    if (user) fetchLeaves();
  }, [user]);

  const handleLeaveCreated = (newLeave) => {
    setLeaves((prev) => [newLeave, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700">Leave Requests</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Request Leave
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Start Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">End Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Reason</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{leave.reason}</td>
                <td className="px-4 py-2 text-sm font-medium">
                  <button
                    onClick={() => navigate(`/status/${leave._id}`)}
                    className="border border-blue-300 px-3 py-1 rounded-2xl cursor-pointer hover:bg-blue-50"
                  >
                    Status
                  </button>
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500 text-sm">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLeaveCreated={handleLeaveCreated}
        userId={user?._id}
      />
    </div>
  );
};

export default EmployeeLeaves;