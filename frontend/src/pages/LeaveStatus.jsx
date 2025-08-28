import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getLeaveById, approveLeaveApi, rejectLeaveApi } from "../api/leaveApi.js"
import { getUser } from "../utils/getUser"

export default function LeaveStatus() {
  const { id } = useParams()
  const [hoveredRole, setHoveredRole] = useState(null)
  const [leaveData, setLeaveData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await getLeaveById(id)
        setLeaveData(response.data)
        let { role } = getUser()
        setCurrentUserRole(role)

        setLoading(false)
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.message || 'Failed to fetch leave details')
        setLoading(false)
      }
    }
    fetchLeave()
  }, [id])

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      const response = await approveLeaveApi(id)
      setLeaveData(response.data)
      const updatedResponse = await getLeaveById(id)
      setLeaveData(updatedResponse.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      const response = await rejectLeaveApi(id)
      setLeaveData(response.data)
      const updatedResponse = await getLeaveById(id)
      setLeaveData(updatedResponse.data)

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStageStyles = (stageStatus) => {
    switch (stageStatus) {
      case 'Approved':
        return 'bg-green-100  shadow-[0_0_18px_6px_rgba(110,255,134,1)]'
      case 'Pending':
        return 'bg-yellow-100 border border-yellow-400 shadow-[0_0_40px_rgba(300,204,50,2)]'
      case 'Rejected':
        return 'bg-red-100  shadow-[0_0_18px_6px_rgba(243,64,64,0.6)]'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const getApprovalStatus = (role) => {
    if (!leaveData || !leaveData.approvalFlow) return 'Upcoming'
    const stage = leaveData.approvalFlow.find((s) => s.role === role)
    return stage?.status || 'Upcoming'
  }

  const getEmployeeStatus = () => {
    if (!leaveData) return 'Pending'
    if (leaveData.leaveRequest?.status === 'Approved') return 'Approved'
    if (leaveData.leaveRequest?.status === 'Rejected') return 'Rejected'
    return 'Approved'
  }

  if (loading) return <div className="text-center p-8">Loading...</div>
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>
  if (!leaveData) return <div className="text-center p-8">No leave data found</div>

  const { leaveRequest } = leaveData

  const roles = [
    {
      id: "employee",
      name: "Employee",
      position: { left: "4rem", top: "4rem" },
      status: getEmployeeStatus(),
      image: "/ziya1.png",
      fallback: "E",
      labelPosition: "top",
    },
    {
      id: "teamlead",
      name: "Team Lead",
      position: { left: "16rem", top: "14rem" },
      status: getApprovalStatus('Team Lead'),
      image: "/ziya2.png",
      fallback: "TL",
      labelPosition: "bottom",
    },
    {
      id: "projectlead",
      name: "Project Lead",
      position: { left: "44%", top: "0.5rem", transform: "translateX(-50%)" },
      status: getApprovalStatus('Project Lead'),
      image: "/ziya3.png",
      fallback: "PL",
      labelPosition: "top",
    },
    {
      id: "hr",
      name: "HR",
      position: { right: "22.2rem", top: "13.3rem" },
      status: getApprovalStatus('HR'),
      image: "/ziya4-.png",
      fallback: "HR",
      labelPosition: "bottom",
    },
    {
      id: "ceo",
      name: "CEO",
      position: { right: "12.2rem", top: "4rem" },
      status: getApprovalStatus('CEO'),
      image: "/ziya5.png",
      fallback: "CEO",
      labelPosition: "top",
    },
  ]

  const lineConnections = [
    { src: "/Vector1.png", srcGreen: "/Vector1g.png", from: 0, to: 1, style: { left: "94px", top: "140px", width: "180px", height: "120px" } },
    { src: "/Vector2.png", srcGreen: "/Vector2g.png", from: 1, to: 2, style: { left: "305px", top: "55px", width: "180px", height: "200px" } },
    { src: "/Vector3.png", srcGreen: "/Vector3g.png", from: 2, to: 3, style: { left: "480px", top: "60px", width: "180px", height: "200px" } },
    { src: "/Vector4.png", srcGreen: "/Vector4g.png", from: 3, to: 4, style: { left: "700px", top: "125px", width: "180px", height: "145px" } },
  ]

  const getVectorSource = (connectionIndex) => {
    if (leaveRequest?.status === 'Rejected') {
      return lineConnections[connectionIndex].src
    }
    if (leaveRequest?.status === 'Approved') {
      return lineConnections[connectionIndex].srcGreen
    }
    const lastApprovedIndex = roles.findIndex(role => role.status !== 'Approved') - 1

    if (connectionIndex <= lastApprovedIndex) {
      return lineConnections[connectionIndex].srcGreen
    }

    return lineConnections[connectionIndex].src
  }
  console.log(leaveRequest);


  return (
    <div className="min-h-screen bg-gray-50 p-8 content-center">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 h-[80vh] flex flex-col">
        <div className=" flex justify-between ">

          <h1 className="text-2xl font-medium text-gray-800 mb-2">Leave Status
          </h1>
          <span className="px-4 py-2 text-xs text-end ">
            <button
              className="border border-blue-300 px-2 py-1 rounded-2xl "
            >
              {leaveRequest?.status}
            </button>
          </span>
        </div>
        <div className="w-full h-px bg-blue-200 mb-20"></div>



        {/* Mobile*/}
        <div className="lg:hidden mb-8">
          <div className="space-y-2">
            {roles.map((role, index) => (
              <div key={role.id} className="flex flex-col items-center">
                {index > 0 && (
                  <div className={`w-0.5 h-6 relative mb-1 ${role.status === "Approved" ? "bg-green-100" : role.status === "Pending" ? "bg-yellow-300" : role.status === "Rejected" ? "bg-red-100" : "bg-gray-300 "
                            }`}>
                    {(roles[index - 1].status === 'Approved' && role.status === 'Approved') && (
                      <div className="absolute inset-0 bg-green-400"></div>
                    )}
                    {roles[index - 1].status === 'Rejected' && (
                      <div className="absolute inset-0 bg-red-400"></div>
                    )}
                  </div>
                )}

                <div className="flex items-center w-full">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getStageStyles(role.status)}`}>
                        {role.image ? (
                          <img
                            src={role.image}
                            alt={role.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none"
                              e.target.nextSibling.style.display = "flex"
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${role.status === "Approved" ? "bg-green-100 text-green-700" :
                              role.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                role.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                            }`}
                          style={{ display: role.image ? 'none' : 'flex' }}
                        >
                          {role.fallback}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-800">{role.name}</p>
                    <p className={`text-sm ${role.status === "Approved" ? "text-green-600" :
                        role.status === "Pending" ? "text-yellow-600" :
                          role.status === "Rejected" ? "text-red-600" : "text-gray-500"
                      }`}>
                      {role.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="relative mt-16 h-full hidden lg:block  ">
          {lineConnections.map((connection, index) => (
            <img
              key={index}
              src={getVectorSource(index)}
              alt={`Connection ${index}`}
              className="absolute hidden lg:block"
              style={connection.style}
            />
          ))}

          {roles.map((role, index) => (
            <div
              key={role.id}
              className="absolute  "
              style={role.position}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div className="flex flex-col items-center cursor-pointer">
                {role.labelPosition === "top" && (
                  <span
                    className={`mb-2 text-base font-semibold transition-all duration-300 ${hoveredRole === role.id ? " transform -translate-y-0.5" : "text-gray-700"
                      }`}
                  >
                    {role.name}
                  </span>
                )}

                <div className="relative ">
                  <img
                    src={role.image}
                    alt={role.name}
                    className={`w-full h-full rounded-full object-cover ${getStageStyles(role.status)} ${hoveredRole === role.id ? "shadow" : ""}`}
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-medium ${role.status === "Approved" ? "bg-green-100 text-green-700" :
                      role.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        role.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                    }`} style={{ display: 'none' }}>
                    {role.fallback}
                  </div>
                </div>

                {role.labelPosition === "bottom" && (
                  <span
                    className={`mt-2 text-base font-semibold transition-all duration-300 ${hoveredRole === role.id ? " transform -translate-y-0.5" : "text-gray-700"
                      }`}
                  >
                    {role.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {currentUserRole === leaveRequest?.currentApprover && leaveRequest?.status === 'Pending' && (
          <div className="text-end content-end mt-auto pt-6">
            <Link to="/requests">
              <p className=" text-gray-700 mb-6 hover:text-blue-600 ">Check Details, Then Approve or Reject</p>
            </Link>
            <div className="flex justify-end gap-6">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className={`px-4 py-2 border border-[#F34040] rounded-lg font-medium transition-colors ${isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#F34040] text-white hover:bg-red-50 hover:text-red-700'
                  }`}
              >
                {isProcessing ? 'Processing...' : 'Reject Leave'}
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isProcessing
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
            <p className={`text-lg font-medium ${leaveRequest?.status === 'Approved' ? 'text-green-600' : 'text-red-600'
              }`}>
              Leave request has been {leaveRequest?.status?.toLowerCase()}!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}