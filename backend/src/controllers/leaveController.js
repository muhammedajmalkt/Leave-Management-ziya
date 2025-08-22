
import User from '../models/userModel.js';
import LeaveRequest from '../models/LeaveRequestModel.js'


const APPROVAL_CHAIN = ['Team Lead', 'Project Lead', 'HR', 'CEO'];

export const createLeaveRequest = async (req, res) => {
    const { employeeId, startDate, endDate, reason } = req.body;
    
    if (!employeeId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'Employee') {
      return res.status(400).json({ message: 'Invalid employee' });
    }

    const leaveRequest = new LeaveRequest({
      employeeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'Pending',
      currentApprover: APPROVAL_CHAIN[0] 
    });

    await leaveRequest.save();
    res.status(201).json({ message: 'Leave request created successfully', leaveRequest });

};

export const getLeaveRequest = async (req, res) => {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('employeeId', 'name profileImage');
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const approvalFlow = APPROVAL_CHAIN.map((role, index) => ({ role,
      status: leaveRequest.currentApprover === role 
        ? 'Pending' 
        : index < APPROVAL_CHAIN.indexOf(leaveRequest.currentApprover) 
          ? 'Approved' 
          : leaveRequest.status === 'Rejected' ? 'Rejected' : 'Upcoming'
    }));

    res.json({ leaveRequest, approvalFlow });

};

export const approveLeaveRequest = async (req, res) => {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const user = await User.findById(req.user.id); 
    if (user.role !== leaveRequest.currentApprover) {
      return res.status(403).json({ message: 'Not authorized to approve' });
    }

    const currentIndex = APPROVAL_CHAIN.indexOf(leaveRequest.currentApprover);
    if (currentIndex === APPROVAL_CHAIN.length - 1) {
      leaveRequest.status = 'Approved';
      leaveRequest.currentApprover = null;
    } else {
      leaveRequest.currentApprover = APPROVAL_CHAIN[currentIndex + 1];
    }

    await leaveRequest.save();
    res.json({ 
      message: 'Leave request approved', 
      leaveRequest 
    });

};

export const rejectLeaveRequest = async (req, res) => {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const user = await User.findById(req.user.id); 
    console.log(user.role );    
    if (user.role !== leaveRequest.currentApprover) {
      return res.status(403).json({ message: 'Not authorized to reject' });
    }

    leaveRequest.status = 'Rejected';
    leaveRequest.currentApprover = null;

    await leaveRequest.save();
    res.json({ 
      message: 'Leave request rejected', 
      leaveRequest 
    });

};


//  specific user
export const getLeavesByUser = async (req, res) => {
        const { userId } = req.params;        
    const leaves = await LeaveRequest.find({ employeeId: userId })
      .populate('employeeId', 'name role ') .sort({ createdAt: -1 });

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ success: false, message: 'No leave requests found for this user' });
    }

    res.json({ success: true, leaves });
};


//all requests
export const getAllLeaveRequests = async (req, res) => {
    const leaves = await LeaveRequest.find()
      .populate('employeeId', 'name role ')
      .sort({ createdAt: -1 });
    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ success: false, message: 'No leave requests found' });
    }

    res.json({ success: true, leaves });

};