const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const Authorization = require("../models/authorization.model");
const { deleteCache, getCache, addCache } = require("../helper/redisCache");

module.exports.registerClient = asyncHandler(async (req, res) => {
  const { name, redirectUrl, permissions } = req.body;

  if (!name) {
    throw new AppError("Product name is required", 400);
  }

  if (!redirectUrl) {
    throw new AppError("Redirect URL is required", 400);
  }

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    throw new AppError("Permissions are required", 400);
  }

  const clientId = crypto.randomBytes(16).toString("hex");
  const clientSecret = crypto.randomBytes(32).toString("hex").toUpperCase();

  const newProduct = new Product({
    userId: req.user.id,
    name,
    clientId,
    clientSecret,
    redirectUri: redirectUrl,
    scopes: permissions,
  });

  //   const newAuthorization = new Authorization({
  //     userId: req.user.id,
  //     productId: newProduct._id,
  //     scopes: permissions,
  //   });

  await newProduct.save();
  //   await newAuthorization.save();

  res.status(201).json({
    message: "Client registered successfully",
  });
});

module.exports.getAllProducts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new AppError("Unauthorized access. Please login again.", 401);
  }

  const products = await Product.find({ userId: userId })
    .select("-__v")
    .sort({ createdAt: -1 });

  if (!products || products.length === 0) {
    return res.status(200).json({
      message: "No products found for this user",
      products: [],
    });
  }

  res.status(200).json({
    message: "Products retrieved successfully",
    products,
  });
});

module.exports.authorizeClient = asyncHandler(async (req, res) => {
  const user = req.user;
  const { client_id, scope, redirect_uri } = req.query;

  if (!client_id) {
    throw new AppError("client_id is required", 400);
  }

  if (!redirect_uri) {
    throw new AppError("redirect_uri is required", 400);
  }

  const product = await Product.findOne({ clientId: client_id });

  if (!product) {
    return res.status(400).json({ message: "Invalid client" });
  }

  if (redirect_uri && redirect_uri !== product.redirectUri) {
    return res.status(400).json({ message: "Invalid redirect URI" });
  }

  let validScopes = [];

  const authorization = await Authorization.findOne({
    userId: user.id,
    productId: product._id,
  });

  if (authorization) {
    return res.status(200).json({
      message: "Permission already granted.",
    });
  }

  if (scope) {
    const requestedScopes = scope.split(",");
    validScopes = requestedScopes.filter((s) => product.scopes.includes(s));
  } else {
    validScopes = product.scopes;
  }

  const API_BASE_URL = process.env.API_BASE_URL;
  const CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const response = await fetch(
    `${API_BASE_URL}/api/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`,
  );
  const data = await response.json();

  console.log(data);

  res.status(200).json({
    message: "Permission required",
    product: product.name,
    requestedScopes: validScopes,
  });
});

module.exports.approveAuthorization = asyncHandler(async (req, res) => {
  const { client_id, redirect_uri, scopes } = req.body;

  if (!client_id) {
    throw new AppError("client_id is required", 400);
  }

  if (!redirect_uri) {
    throw new AppError("redirect_uri is required", 400);
  }

  if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
    return res.status(400).json({ message: "Scopes are required" });
  }

  const product = await Product.findOne({ clientId: client_id });

  if (!product) {
    return res.status(400).json({ message: "Invalid client" });
  }

  if (redirect_uri && redirect_uri !== product.redirectUri) {
    return res.status(400).json({ message: "Invalid redirect URI" });
  }

  const authorization = await Authorization.findOne({
    userId: req.user.id,
    productId: product._id,
  });

  if (authorization) {
    authorization.scopes = scopes;
    await authorization.save();
  } else {
    const createAuthorization = new Authorization({
      userId: req.user.id,
      productId: product._id,
      scopes: scopes,
    });
    await createAuthorization.save();
  }

  return res.status(200).json({
    message: "Authorization approved",
    redirect_uri: `${redirect_uri}?success=true`,
  });
});

module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;
  if (!productId) {
    throw new AppError("Product id is required", 400);
  }

  const product = await Product.findOne({ _id: productId, userId: userId });

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  await Product.deleteOne({ _id: productId });
  await Authorization.deleteMany({ productId: productId });

  res.status(200).json({
    message: "Product deleted successfully",
  });
});

module.exports.checkPermissions = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const CLIENT_ID = process.env.CLIENT_ID;

  if (CLIENT_ID) {
    const product = await Product.findOne({ clientId: CLIENT_ID });

    if (!product) {
      return res.status(400).json({ message: "Invalid client" });
    }

    const authorization = await Authorization.findOne({
      userId: userId,
      productId: product._id,
    });

    if (authorization) {
      return res.status(200).json({
        message: "Permission already granted.",
      });
    }

    return res.status(200).json({
      message: "Permission required",
      product: product.name,
      requestedScopes: product.scopes,
    });
  }

  return res.status(200).json({
    message: "success",
  });
});

module.exports.authorizeUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const CLIENT_ID = process.env.CLIENT_ID;

  if (!userId) {
    throw new AppError("Unauthorized access. Please login again.", 401);
  }

  const cacheKey = `user_permissions_${userId}`;

  const cachedPermissions = await getCache(cacheKey);

  if (cachedPermissions) await deleteCache(cacheKey);

  const product = await Product.findOne({ clientId: CLIENT_ID });

  if (!product) {
    return res.status(400).json({ message: "Invalid client" });
  }
  const authorization = await Authorization.findOne({
    userId: userId,
    productId: product._id,
  });

  if (authorization) throw new AppError("User already authorized.", 400);

  const code = crypto.randomBytes(32).toString("hex");

  const cacheData = {
    userId,
    code,
    email: req.user.email,
    clientId: CLIENT_ID,
  };

  await addCache(cacheKey, JSON.stringify(cacheData), 300);

  res.status(200).json({
    message: "success",
    code,
    scopes: product.scopes,
  });
});

module.exports.grantPermission = asyncHandler(async (req, res) => {
  const { code, scopes } = req.body;
  const userId = req.user.id;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  if (!code) {
    throw new AppError("Authorization code is required", 400);
  }

  if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
    return res.status(400).json({ message: "Scopes are required" });
  }

  const cacheKey = `user_permissions_${userId}`;

  const cachedData = await getCache(cacheKey);

  if (!cachedData) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const {
    userId: cachedUserId,
    code: cachedCode,
    clientId,
  } = JSON.parse(cachedData);

  if (cachedCode !== code) {
    return res.status(400).json({ message: "Invalid authorization code" });
  }

  const product = await Product.findOne({ clientId: clientId });

  if (!product) {
    return res.status(400).json({ message: "Invalid client" });
  }

  const authorization = await Authorization.findOne({
    userId: cachedUserId,
    productId: product._id,
  });

  if (authorization) {
    authorization.scopes = scopes;
    await authorization.save();
  } else {
    const createAuthorization = new Authorization({
      userId: cachedUserId,
      productId: product._id,
      scopes: scopes,
    });
    await createAuthorization.save();
  }

  await deleteCache(cacheKey);

  return res.status(200).json({
    message: "success",
    redirect_uri: `${REDIRECT_URI}?success=true`,
  });
});
