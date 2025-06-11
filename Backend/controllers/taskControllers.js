const Tasks = require("../models/Tasks");
const taskSchema = require("../models/Tasks");
const { getUserById } = require("./userControllers");

// @desc Get all tasks
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }

    let tasks;
    if (req.user.role === 'admin') {
      tasks = await taskSchema.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await taskSchema.find({ ...filter, assignedTo: req.user._id }).populate(
        'assignedTo',
        'name email profileImageUrl'
      );
    }

    // Add completed todo count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Get count of completed tasks
    const allTasks = await taskSchema.countDocuments({
      ...filter,
      status: "Complete",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id })
    });

    res.status(200).json({ tasks, completedTasksCount: allTasks });

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id).populate(
      "assignedTo",
      'name email profileImageUrl'
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Create a new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
    }

    const task = await taskSchema.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklist,
    });

    res.status(201).json({ message: "Task created successfully", task });

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Update task
const updateTask = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", updatedTask });

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin"){
      return res.status(403).json( {message: "Not authorized"} );
    }

    task.status = req.body.status || task.status;

    if (task.status == "Completed") {
      task.todoChecklist.forEach((item) => {item.completed = true})
      task.progress = 100;
    }
    const updatedTask = await task.save();

    res.json({ message: "Status updated", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Update checklist item
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;

    const task = await Tasks.findById(req.params.id);

    if (!task) return res.status(404).json({message: "Task not found"});

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
      return res.status(403).json({message: "Not authorize to update checklist"});
    }

    task.todoChecklist = todoChecklist;

    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItem = task.todoChecklist.length;
    task.progress = 
      totalItem > 0 ? Math.round((completedCount / totalItem) * 100) : 0;
    
    if (task.progress === 100){
      task.status = "Completed"
    }else if (task.progress > 0){
      task.status = "In Progress"
    }else{
      task.status = "Pending";
    }

    await task.save();
    const updateTask = await Tasks.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({message: "Task checklist updated", task: updateTask})
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Get admin dashboard data
const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await taskSchema.countDocuments();
    const completedTasks = await taskSchema.countDocuments({ status: "Complete" });
    // const inProgress = await taskSchema.countDocuments({ status: "In Progress" });
    const pendingTasks = await taskSchema.countDocuments({ status: "Pending" });

    const overdueTasks = await taskSchema.countDocuments({
      status: {$ne: "Completed"},
      dueDate: {$lt: new Date()}
    });

    const taskStatuses = ["Pending", "In Progress", "Complete"];
    const taskDistributionRaw = await taskSchema.aggregate([
      {
        $group: {
          _id: "$status",
          count: {$sum: 1}
        },
      }
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = 
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;



    

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await taskSchema.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = 
       taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc; 
    }, {});

    const recentTasks = await taskSchema.find()
      .sort({createdAt: -1})
      .limit(10)
      .select("title status priority dueDate createdAt")


    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Get dashboard data for a user
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalTasks = await taskSchema.countDocuments();
    const completedTasks = await taskSchema.countDocuments({ status: "Complete" });
    const inProgressTasks = await taskSchema.countDocuments({ status: "In Progress" });
    const pendingTasks = await taskSchema.countDocuments({ status: "Pending" });

    const overdueTasks = await taskSchema.countDocuments({
      status: {$ne: "Completed"},
      dueDate: {$lt: new Date()}
    });

    const taskStatuses = ["Pending", "In Progress", "Complete"];
    const taskDistributionRaw = await taskSchema.aggregate([
      {
        $match: {assignedTo: userId}
      },
      {
        $group: {
          _id: "$status",
          count: {$sum: 1}
        },
      }
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = 
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    });
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await taskSchema.aggregate([
      {
        $match: {assignedTo: userId}
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = 
       taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc; 
    }, {});

    const recentTasks = await taskSchema.find()
      .sort({createdAt: -1})
      .limit(10)
      .select("title status priority dueDate createdAt")


    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
