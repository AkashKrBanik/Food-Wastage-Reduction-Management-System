import React, { useState } from "react";
import axios from "axios";

const SmartRec = () => {
    const [ingredients, setIngredients] = useState(""); // To store user input
    const [meals, setMeals] = useState(null); // To store fetched meals
    const [loading, setLoading] = useState(false); // To show loading state

    const aiResponses = [
        "Here's a delicious recipe for you:",
        "I think you'll love this dish:",
        "How about trying this recipe?",
        "This recipe is perfect for your ingredients!",
    ];

    const fetchGeneratedContent = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_DEV_URL}/auth/generate-content`, {
                ingredients,
            });
            const { data } = response;
            setMeals(data.recipes || [data.recipe]); // Support for multiple recipes
        } catch (error) {
            console.error("Error fetching generated content:", error);
        } finally {
            setLoading(false);
        }
    };

    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <h1 className="text-center text-3xl font-bold py-6 text-white">
                Smart Recipe Suggestions
            </h1>
            <p className="text-center text-lg mb-6 text-gray-400">
                Find recipes based on your ingredients!
            </p>

            {/* Input Section */}
            <div className="flex justify-center items-center mb-8">
                <input
                    type="text"
                    placeholder="Enter ingredients (e.g., chicken, rice, tomato)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-2/3 sm:w-1/2 px-4 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchGeneratedContent}
                    className="ml-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-500 transition"
                >
                    {loading ? "Loading..." : "Search"}
                </button>
            </div>

            {/* Recipes Section */}
            <div className="px-4">
                {loading ? (
                    <div className="text-center text-gray-400">
                        <p>🤖 Thinking...</p>
                        <p className="animate-pulse">Generating your recipe...</p>
                    </div>
                ) : meals ? (
                    meals.map((meal, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {randomResponse} {meal.dishName}
                            </h2>
                            <p className="text-gray-400 mb-2">
                                <strong>Prep Time:</strong> {meal.prepTime}
                            </p>
                            <p className="text-gray-400 mb-2">
                                <strong>Cooking Time:</strong> {meal.cookingTime}
                            </p>
                            <p className="text-gray-400 mb-4">
                                <strong>Serving Size:</strong> {meal.servingSize}
                            </p>
                            <h3 className="text-xl font-semibold mb-2 text-white">Ingredients:</h3>
                            <ul className="list-disc list-inside mb-4 text-gray-300">
                                {meal.ingredients?.map((ingredient, i) => (
                                    <li key={i}>{ingredient}</li>
                                ))}
                            </ul>
                            <h3 className="text-xl font-semibold mb-2 text-white">Instructions:</h3>
                            <ol className="list-decimal list-inside mb-4 text-gray-300">
                                {meal.instructions?.map((instruction, i) => (
                                    <li key={i}>{instruction}</li>
                                ))}
                            </ol>
                            <h3 className="text-xl font-semibold mb-2 text-white">
                                Additions/Substitutions:
                            </h3>
                            <p className="text-gray-300 mb-4">{meal.additionsSubstitutions}</p>
                            <h3 className="text-xl font-semibold mb-2 text-white">Variations:</h3>
                            <p className="text-gray-300 mb-4">{meal.variations}</p>
                            <h3 className="text-xl font-semibold mb-2 text-white">AI Tips:</h3>
                            <ul className="list-disc list-inside text-gray-300">
                                <li>Try adding a pinch of cinnamon for a unique flavor twist!</li>
                                <li>Pair this dish with a fresh green salad for a balanced meal.</li>
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">
                        Enter ingredients and click "Search" to see recipe suggestions.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SmartRec;