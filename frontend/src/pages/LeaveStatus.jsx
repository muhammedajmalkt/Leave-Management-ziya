import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLeaveById, approveLeaveApi, rejectLeaveApi } from '../api/leaveApi.js';
import { getUser } from '../utils/getUser';

const LeaveStatus = () => {
  const { id } = useParams(); 
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await getLeaveById(id);
        setLeaveData(response.data);
        let {role} = getUser()

        setCurrentUserRole(role);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || 'Failed to fetch leave details');
        setLoading(false);
      }
    };
    fetchLeave();
  }, [id]);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const response = await approveLeaveApi(id);
      setLeaveData(response.data); 
      const updatedResponse = await getLeaveById(id);
      setLeaveData(updatedResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const response = await rejectLeaveApi(id);
      setLeaveData(response.data);
      const updatedResponse = await getLeaveById(id);
      setLeaveData(updatedResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStageStyles = (stageStatus) => {
    switch (stageStatus) {
      case 'Approved':
        return 'bg-green-100 border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.5)]';
      case 'Pending':
        return 'bg-yellow-100 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.5)]';
      case 'Rejected':
        return 'bg-red-100 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.5)]';
      default: 
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getPathColor = (fromStage, toStage) => {
    if (!leaveData || !leaveData.approvalFlow) return '#6b7280';
    
    if (leaveData.leaveRequest?.status === 'Rejected') return '#ef4444';
    
    const fromIndex = leaveData.approvalFlow.findIndex((x) => x.role === fromStage);
    const toIndex = leaveData.approvalFlow.findIndex((s) => s.role === toStage);
    
    if (fromIndex === -1 || toIndex === -1) return '#6b7280';
    
    return leaveData.approvalFlow[fromIndex]?.status === 'Approved' &&
           leaveData.approvalFlow[toIndex]?.status !== 'Upcoming' ? '#22c55e' : '#6b7280'; };

  const getApprovalStatus = (role) => {
    if (!leaveData || !leaveData.approvalFlow) return 'Upcoming';
    const stage = leaveData.approvalFlow.find((s) => s.role === role);
    return stage?.status || 'Upcoming';
  };

  const getEmployeeStatus = () => {
    if (!leaveData) return 'Pending';
    if (leaveData.leaveRequest?.status === 'Approved') return 'Approved';
      if (leaveData.leaveRequest?.status === 'Rejected') return 'Rejected';
    return 'Approved';
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!leaveData) return <div className="text-center p-8">No leave data found</div>;

  const { leaveRequest, approvalFlow } = leaveData;

  return (
    <div className="min-h-screen bg-gray-50 p-8 content-center">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 h-[80vh] flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">Leave Status</h1>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        <div className="relative mb-16 h-full">
          <div className="absolute left-8 top-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Employee</span>
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${getStageStyles(
                    getEmployeeStatus()
                  )}`}
                >
                  <span className="text-gray-700 font-medium">EM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-80 bottom-16">
            <div className="flex flex-col items-center gap-2">

              <span className="text-sm font-medium text-gray-700">Team Lead</span>
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${getStageStyles(
                    getApprovalStatus('Team Lead')
                  )}`}
                >
                  <span className="text-gray-700 font-medium">TL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-4 transform -translate-x-1/2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Project Lead</span>
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${getStageStyles(
                    getApprovalStatus('Project Lead')
                  )}`}
                >
                  <span className="text-gray-700 font-medium">PL</span>
                </div>
              </div>
            </div>
          </div>

          {/* HR */}
          <div className="absolute right-74 bottom-16">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-gray-700">HR</span>
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${getStageStyles(
                    getApprovalStatus('HR')
                  )}`}
                >
                  <span className="text-gray-700 font-medium">HR</span>
                </div>
              </div>
            </div>
          </div>

          {/* CEO */}
          <div className="absolute right-8 top-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-gray-700">CEO</span>
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${getStageStyles(
                    getApprovalStatus('CEO')
                  )}`}
                >
                  <span className="text-gray-700 font-medium">CEO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dotted Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '300px' }}>
            <path d="M 120 90 Q 200 180 230 210"     
          stroke={getPathColor('Employee', 'Team Lead')}
              strokeWidth="2"
              strokeDasharray="8,4"
              fill="none"
            />

            <path
              d="M 380 280 Q 450 120 500 60"
              stroke={getPathColor('Team Lead', 'Project Lead')}
              strokeWidth="2"
              strokeDasharray="8,4"
              fill="none"
            />
            <path
              d="M 600 50 Q 760 250 880 680"
              stroke={getPathColor('Project Lead', 'HR')}
              strokeWidth="2"
              strokeDasharray="8,4"
              fill="none"
            />
            {/* HR to CEO */}
            <path
              d="M 10 950 Q 900 290 980 90"
              stroke={getPathColor('HR', 'CEO')}
              strokeWidth="2"
              strokeDasharray="8,4"
              fill="none"
            />
          </svg>
        </div>

        {currentUserRole === leaveRequest?.currentApprover && leaveRequest?.status === 'Pending' && (
          <div className="text-end content-end mt-auto pt-6">
            <Link to="/requests">
              <p className="text-lg text-gray-700 mb-6 hover:text-blue-600 ">Check Details, Then Approve or Reject</p>
            </Link>
            <div className="flex justify-end gap-6">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className={`px-8 py-3 border border-[#F34040] rounded-lg font-medium transition-colors ${
                  isProcessing 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#F34040] text-white hover:bg-red-50 hover:text-red-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Reject Leave'}
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#31ED31] text-white hover:bg-green-600'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Approve Leave'}
              </button>
            </div>
          </div>
        )}

        {!isProcessing && leaveRequest?.status !== 'Pending' && (
          <div className="text-center mt-4">
            <p className={`text-lg font-medium ${
              leaveRequest?.status === 'Approved' ? 'text-green-600' : 'text-red-600'
            }`}>
              Leave request has been {leaveRequest?.status?.toLowerCase()}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveStatus;