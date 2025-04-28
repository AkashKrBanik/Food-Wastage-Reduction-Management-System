const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateUser = require("../middleware/auth");
const Notification = require("../models/Notif");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");


// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Data:", { email, password });
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    console.log("User:", user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: "7d",
    });
    console.log("Token", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/jwt", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = jwt.verify(token, "secret");
    console.log("User", user);
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
})

router.post("/logout", async (req, res) => {
  const { email } = req.body;
  const user = await User.updateOne({ email }, { token: "" });
  res.clearCookie("token").json({ message: "Logged out" });
});

router.post("/notifications", authenticateUser, async (req, res) => {
  try {
    const { email } = req.body;
    const notifications = await Notification.find({ recipient: email }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/notifications/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/notifications/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// If using ES Modules: import { GoogleGenerativeAI } from "@google/generative-ai";
//                     import express from 'express';

// --- You would typically define your router elsewhere ---
// const router = express.Router();

// --- Your route handler ---
router.post("/generate-content", async (req, res) => {
  // 1. Extract Ingredients from Request Body
  const { ingredients } = req.body;

  // 2. Validate Input
  if (!ingredients || typeof ingredients !== 'string' || ingredients.trim() === "") {
    // Check if ingredients exist, are a string, and are not just whitespace
    return res.status(400).json({ message: "Ingredients (string) are required in the request body." });
  }
  const trimmedIngredients = ingredients.trim(); // Use trimmed version

  // 3. Get API Key and Validate
  const apiKey = process.env.GEN_API_KEY;
  if (!apiKey) {
    console.error("FATAL ERROR: Google Generative AI API key (GEN_API_KEY) is missing in environment variables.");
    return res.status(500).json({ error: "Server configuration error: API key is missing." });
  }
  // Optional: Log only that the key is present, not the key itself for security
  console.log("Using Google Generative AI API Key: Present");

  try {
    // 4. Initialize Google Generative AI Client
    const genAI = new GoogleGenerativeAI(apiKey);

    // 5. Select the Generative Model
    // Note: 'gemini-2.5-pro-exp-03-25' might be experimental.
    // Consider using stable aliases like 'gemini-1.5-pro-latest' or 'gemini-1.5-flash-latest'
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Using a standard alias here

    // 6. Construct the Prompt
    // This detailed prompt structure is good!
    const prompt = `
      I have these leftover ingredients: ${trimmedIngredients}.

      Create a creative recipe that primarily uses them, minimizing waste.

      **Format the entire response STRICTLY as a single, valid JSON object.**
      **Do NOT include any introductory text, explanations, markdown formatting (like \`\`\`json), or any characters outside the JSON object itself.**

      The JSON object should have the following structure:
      {
        "dishName": "String",
        "prepTime": "String (e.g., '10 minutes')",
        "cookingTime": "String (e.g., '15 minutes')",
        "ingredients": ["String ingredient 1", "String ingredient 2", ...],
        "instructions": ["String step 1", "String step 2", ...],
        "additionsSubstitutions": "String (or null if none)",
        "servingSize": "String (e.g., '2 servings')",
        "variations": "String (or null if none)"
      }

      Ensure all text values within the JSON are properly escaped strings.
      Generate the recipe details based on the provided ingredients: ${trimmedIngredients}.
    `;

    console.log(`Generating content for ingredients: ${trimmedIngredients}`);

    // 7. Define Generation Configuration (optional, defaults exist)
    const generationConfig = {
      temperature: 0.7,        // Controls randomness (creativity vs. predictability)
      candidateCount: 1,       // Number of response candidates to generate
      maxOutputTokens: 1024,     // Increased max tokens for potentially longer recipes
      topP: 0.8,               // Nucleus sampling parameter
      topK: 40                 // Top-K sampling parameter
    };

    // 8. Call the API to Generate Content
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: generationConfig // Pass the config here
    });

    // 9. Process the API Response
    // Using optional chaining for safety in case the structure is unexpected
    const generatedText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error("API Error: No text content received in the response.", JSON.stringify(result, null, 2));
      return res.status(500).json({ error: "Failed to generate content: Empty response from AI model." });
    }

    console.log("Successfully generated content.");
    console.log(generatedText);
    // console.log("Full API Response:", JSON.stringify(result, null, 2)); // Keep for detailed debugging if needed

    // 10. Send Successful Response to Client
    // Send the generated text within a consistent JSON structure
    res.status(200).json({ recipe: JSON.parse(generatedText) });

  } catch (error) {
    // 11. Handle Errors during API call or processing
    console.error("API Call Error:", error.message); // Log the specific error message
    // Log the full error for server-side debugging, but don't send it all to the client
    console.error("Full Error Details:", error);

    // Send a generic error message to the client
    res.status(500).json({
        error: "Failed to generate content due to an internal server error.",
        // Optionally include a non-sensitive detail if available and helpful
        // details: error.message // Be cautious about exposing internal details
    });
  }
});


module.exports = router;
