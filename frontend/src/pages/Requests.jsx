import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLeaves } from '../api/leaveApi.js';
import { getUser } from '../utils/getUser.js';

const Requests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        let {role} = getUser()

        setUserRole(role);

        if (['Team Lead', 'Project Lead', 'HR', 'CEO'].includes(role)) {
          const response = await getAllLeaves();
          
          setLeaves(response.data.leaves);
        } else {
          setError('Not authorized to view all leave requests');
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        
        setError(err.response?.data?.message || 'Failed to fetch leave requests');
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg  p-8">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">All Leave Requests</h1>
        {leaves.length === 0 ? (
          <p className="text-gray-600">No leave requests found.</p>
        ) : (
          <div className="space-y-4">
            {leaves?.map((leave) => (
              <Link
                key={leave._id}
                to={`/status/${leave._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <p className="text-gray-800 font-medium">
                  {leave?.employeeId?.name} - {leave.reason}
                </p>
                <p className="text-gray-600">
                  {new Date(leave.startDate).toLocaleDateString()} -{' '}
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Status: {leave.status}</p>
                <p className="text-gray-600">Current Approver: {leave.currentApprover || 'None'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
