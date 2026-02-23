const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const AppError = require("../utils/appError");
const { sendMail } = require("../helper/sendMail");
const randomId = require("random-id");
const { getCache, deleteCache, addCache } = require("../helper/redisCache");
const mongoose = require("mongoose");
const ExcelRowModel = require("../models/excelRow.model");
const ExcelFileModel = require("../models/excelFile.model");

module.exports.getDashboardStats = async (user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [userStats, postStats] = await Promise.all([
    // USERS AGGREGATION
    userModel.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          todayUsers: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" },
          ],
        },
      },
    ]),

    // POSTS AGGREGATION
    postModel.aggregate([
      {
        $facet: {
          totalPosts: [{ $count: "count" }],
          todayPosts: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" },
          ],
        },
      },
    ]),
  ]);

  return {
    totalUsers: userStats[0].totalUsers[0]?.count || 0,
    todayUsers: userStats[0].todayUsers[0]?.count || 0,
    totalPosts: postStats[0].totalPosts[0]?.count || 0,
    todayPosts: postStats[0].todayPosts[0]?.count || 0,
  };
};

//
module.exports.getAdmins = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const admins = await userModel
    .find({
      role: { $in: ["admin", "super-admin"] },
      _id: { $ne: user.id },
      ...(args.query && { email: { $regex: args.query, $options: "i" } }),
    })
    .sort({ createdAt: -1 })
    .lean();

  if (!admins || admins.length === 0) {
    throw new AppError("No admins found", "NOT_FOUND");
  }

  const updated = admins.map((admin) => {
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      role: admin.role,
      isVerified: admin.isVerified,
      createdAt: admin.createdAt,
    };
  });

  return updated;
};
//

module.exports.getAllUsers = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const query = args?.query || "";
  const page = query && query !== "" ? 1 : query || 1;
  const limit = args?.limit || 20;
  const skip = (page - 1) * limit;

  if (limit > 40) {
    throw new AppError("Limit cannot be greater than 40", "BAD_REQUEST");
  }

  try {
    const cacheKey = query
      ? `users:${page}:${limit}:query:${query}`
      : `users:${page}:${limit}`;

    const cachedUsers = await getCache(cacheKey);
    if (cachedUsers) {
      const data = JSON.parse(cachedUsers);
      return {
        success: true,
        message: "success",
        data: data.data,
        length: data.length,
      };
    }
    const users = await userModel
      .find({
        role: "user",
        _id: { $ne: user.id },
        ...(query && { email: { $regex: query, $options: "i" } }),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!users || users.length === 0) {
      throw new AppError("No users found", "NOT_FOUND");
    }

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    }));

    const responseData = {
      success: true,
      message: "success",
      data: formattedUsers,
      length: formattedUsers?.length || 0,
    };

    await addCache(cacheKey, JSON.stringify(responseData));

    return responseData;
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

//
module.exports.changeAccountStatus = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { userId } = args;

  const permission = user.permissions;

  if (!permission.activeUser) {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  if (!userId) {
    throw new AppError("UserId is required", "BAD_REQUEST");
  }

  const userToChange = await userModel.findById(userId).lean();

  if (!userToChange) {
    throw new AppError("User not found", "NOT_FOUND");
  }

  try {
    const updated = await userModel.findByIdAndUpdate(
      userId,
      {
        isActive: !userToChange.isActive,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return {
      success: true,
      message: "success",
      data: {
        id: updated._id,
        isActive: updated.isActive,
      },
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

//
module.exports.deleteUser = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { userId } = args;

  const permission = user.permissions;

  if (!permission.deleteUser) {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  if (!userId) {
    throw new AppError("UserId is required", "BAD_REQUEST");
  }

  if (user.id === userId) {
    throw new AppError("Cannot delete yourself", "BAD_REQUEST");
  }

  const userToDelete = await userModel.findById(userId).lean();

  if (!userToDelete) {
    throw new AppError("User not found", "NOT_FOUND");
  }

  if (userToDelete.role === "admin") {
    throw new AppError("Cannot delete an admin", "BAD_REQUEST");
  }

  try {
    const deleted = await userModel.findByIdAndDelete(userId);

    return {
      success: true,
      message: "User deleted successfully",
      data: {
        id: deleted._id,
      },
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// add user
module.exports.addUser = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { name, email, password, isActive, isVerified } = args;

  if (!name || !email || !password) {
    throw new AppError("All fields are required", "BAD_REQUEST");
  }

  const existingUser = await userModel.findOne({ email }).lean();

  if (existingUser) {
    throw new AppError("User already exists", "BAD_REQUEST");
  }

  try {
    const created = await userModel.create({
      name,
      email,
      password,
      isActive,
      isVerified,
    });
    return {
      success: true,
      message: "User created successfully",
      data: {
        id: created._id,
        name: created.name,
        email: created.email,
        isActive: created.isActive,
        isVerified: created.isVerified,
        createdAt: created.createdAt,
      },
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// add admin
module.exports.addAdmin = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { name, email, isActive, isVerified, role } = args;

  if (!name || !email) {
    throw new AppError("All fields are required", "BAD_REQUEST");
  }

  const existingUser = await userModel.findOne({ email }).lean();

  if (existingUser) {
    throw new AppError("User already exists", "BAD_REQUEST");
  }

  const token = randomId(30, "aA0");
  const cacheKey = `set-password-tokens:${token}`;
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const randomPassword = randomId(10, "aA0");

  try {
    const oldData = await getCache(cacheKey);

    if (oldData) await deleteCache(cacheKey);

    const cacheData = {
      email: email,
      token: token,
    };

    await userModel.create({
      name,
      email,
      isActive,
      isVerified,
      role: role,
      password: randomPassword,
    });

    const emailMessage = `Click on this link to set new password: ${`${FRONTEND_URL}/admin/set-password?token=${token}`}`;

    await sendMail(email, "Set your password", emailMessage);

    await addCache(cacheKey, JSON.stringify(cacheData), 86400);

    return {
      success: true,
      message: "admin created successfully",
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// set new password
module.exports.setNewPassword = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { token, password } = args;

  if (!token || !password) {
    throw new AppError("All fields are required", "BAD_REQUEST");
  }

  const cacheKey = `set-password-tokens:${token}`;

  try {
    const cacheData = await getCache(cacheKey);

    if (!cacheData) {
      throw new AppError("Invalid token or token expired", "BAD_REQUEST");
    }

    const { email, token: cacheToken } = JSON.parse(cacheData);

    if (!cacheToken || !email) {
      throw new AppError("Invalid token or token expired", "BAD_REQUEST");
    }

    if (cacheToken !== token) {
      throw new AppError("Invalid token", "BAD_REQUEST");
    }

    const userToChange = await userModel.findOne({ email });

    if (!userToChange) {
      throw new AppError("User not found", "BAD_REQUEST");
    }

    userToChange.password = password;
    await userToChange.save();
    await deleteCache(cacheKey);

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

//
module.exports.getAdminPermissions = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { userId } = args;

  if (!userId) {
    throw new AppError("UserId is required", "BAD_REQUEST");
  }

  if (user.id === userId) {
    throw new AppError("Cannot get permissions for yourself", "BAD_REQUEST");
  }

  if (mongoose.Types.ObjectId.isValid(userId) === false) {
    throw new AppError("Invalid userId", "BAD_REQUEST");
  }

  try {
    const userData = await userModel.findById(userId).lean();

    if (!userData) {
      throw new AppError("User not found", "NOT_FOUND");
    }

    const permissions = userData.permissions;

    return permissions;
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// updateAdminPermissions
module.exports.updateAdminPermissions = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const { userId, activeUser, deleteUser, activeAdmin, deleteAdmin } = args;

  if (!userId) {
    throw new AppError("UserId is required", "BAD_REQUEST");
  }

  if (user.id === userId) {
    throw new AppError("Cannot update permissions for yourself", "BAD_REQUEST");
  }

  if (mongoose.Types.ObjectId.isValid(userId) === false) {
    throw new AppError("Invalid userId", "BAD_REQUEST");
  }

  try {
    const userData = await userModel.findById(userId).lean();

    if (!userData) {
      throw new AppError("User not found", "NOT_FOUND");
    }

    if (userData.role !== "admin" && userData.role !== "super-admin") {
      throw new AppError("User is not an admin", "BAD_REQUEST");
    }

    await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          permissions: {
            activeUser,
            deleteUser,
            activeAdmin,
            deleteAdmin,
          },
        },
      },
      { returnDocument: "after" },
    );

    return {
      success: true,
      message: "Permissions updated successfully",
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// getAdminCharts
module.exports.getAdminCharts = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  let timeRange = args?.timeRange || "7d";

  const validTimeRanges = ["7d", "30d", "90d"];

  if (!validTimeRanges.includes(timeRange)) {
    throw new AppError(
      "Invalid time range. Valid options are 7d, 30d, 3 months",
      "BAD_REQUEST",
    );
  }

  try {
    const cacheKey = `admin-charts:${timeRange}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // date calculations
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let startDate;

    if (timeRange === "7d") {
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    } else if (timeRange === "30d") {
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    } else if (timeRange === "90d") {
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
    } else {
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // default to 7 days
    }

    // aggregation
    const data = await userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          users: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          users: 1,
        },
      },
    ]);

    // cache the results for 1 hour
    if (data.length > 0) {
      await addCache(cacheKey, JSON.stringify(data), 3600);
    }

    return data;
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// getAdminUserStatusCharts
module.exports.getAdminUserStatusCharts = async (user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  try {
    const cacheKey = `admin-user-status-charts`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await userModel.aggregate([
      {
        $match: {
          role: "user",
        },
      },
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          activeUsers: [{ $match: { isActive: true } }, { $count: "count" }],
          inactiveUsers: [{ $match: { isActive: false } }, { $count: "count" }],
          verifiedUsers: [
            { $match: { isVerified: true } },
            { $count: "count" },
          ],
          unverifiedUsers: [
            { $match: { isVerified: false } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const response = {
      success: true,
      message: "success",
      data: {
        totalUsers: data[0].totalUsers[0]?.count || 0,
        activeUsers: data[0].activeUsers[0]?.count || 0,
        inactiveUsers: data[0].inactiveUsers[0]?.count || 0,
        verifiedUsers: data[0].verifiedUsers[0]?.count || 0,
        unverifiedUsers: data[0].unverifiedUsers[0]?.count || 0,
      },
    };

    await addCache(cacheKey, JSON.stringify(response), 3600); // cache for 1 hour

    return response;
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// upload file
module.exports.getExcelFile = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const page = args?.page || 1;
  const limit = args?.limit || 20;
  const skip = (page - 1) * limit;
  const { fileId } = args;

  if (!fileId) {
    throw new AppError("fileId is required", "BAD_REQUEST");
  }

  if (mongoose.Types.ObjectId.isValid(fileId) === false) {
    throw new AppError("Invalid fileId", "BAD_REQUEST");
  }

  try {
    const fileData = await ExcelFileModel.findById(fileId).lean();

    if (!fileData || fileData.length === 0) {
      throw new AppError("File not found", "NOT_FOUND");
    }

    if (fileData.uploadedBy.toString() !== user.id.toString()) {
      throw new AppError("Unauthorized to access this file", "UNAUTHORIZED");
    }

    const rows = await ExcelRowModel.find({ fileId })
      // .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit)
      .lean();

    if (!rows || rows.length === 0) {
      throw new AppError("No data found for this file", "NOT_FOUND");
    }

    const formattedRows = rows.map((r) => r.data);

    return {
      success: true,
      message: "success",
      rows: formattedRows,
      length: formattedRows.length,
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// get all uploaded excel file
module.exports.getAllExcelFile = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const page = args?.page || 1;
  const limit = args?.limit || 20;
  const skip = (page - 1) * limit;
  const isPublic = args?.isPublic || false;

  let dbQuery = {};

  if (isPublic === false) {
    dbQuery = {
      uploadedBy: user.id,
    };
  } else {
    dbQuery = {
      visibility: "public",
      uploadedBy: { $ne: user.id },
    };
  }

  try {
    const fileData = await ExcelFileModel.find(dbQuery)
      .select("-__v -updatedAt -totalRows")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (fileData.length === 0) {
      throw new AppError("No file found", "NOT_FOUND");
    }

    return {
      success: true,
      message: "success",
      data: fileData,
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// changeFileVisibility
module.exports.changeFileVisibility = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const fileId = args.fileId;
  const visibility = args.visibility;

  if (!fileId) {
    throw new AppError("Please enter fileId", "BAD_REQUEST");
  }

  if (!visibility || visibility === "") {
    throw new AppError("Please enter visibility", "BAD_REQUEST");
  }

  const visibilityType = ["public", "private"];

  if (!visibilityType.includes(visibility)) {
    throw new AppError(
      "Invalid visibility. Please use 'public' or 'private'",
      "BAD_REQUEST",
    );
  }

  try {
    const file = await ExcelFileModel.findById(fileId);

    if (!file) {
      throw new AppError("Invalid file Id", "NOT_FOUND");
    }

    if (file.uploadedBy.toString() !== user.id.toString()) {
      throw new AppError("Unauthorized to change visibility", "UNAUTHORIZED");
    }

    file.visibility = visibility;
    await file.save();

    return {
      success: true,
      message: "Visibility changed successfully",
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};

// delete file
module.exports.deleteFile = async (args, user) => {
  if (!user) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new AppError("Unauthorized to access this resource", "UNAUTHORIZED");
  }

  const fileId = args.fileId;

  if (!fileId) {
    throw new AppError("Please enter fileId", "BAD_REQUEST");
  }

  try {
    const file = await ExcelFileModel.findById(fileId);

    if (!file) {
      throw new AppError("Invalid file Id", "NOT_FOUND");
    }

    if (file.uploadedBy.toString() !== user.id.toString()) {
      throw new AppError("Unauthorized to delete this file", "UNAUTHORIZED");
    }

    await ExcelRowModel.deleteMany({ fileId });
    await file.deleteOne();

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (err) {
    const message = err.message || "Something went wrong";
    throw new AppError(message, "INTERNAL_SERVER_ERROR");
  }
};
