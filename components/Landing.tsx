"use client";
import React, { useState } from 'react'

interface UserInput{
    age:number;
    weight: number;
    gender:string;
    height:number;
    activity_level: string;
    goal:string;
}

interface Exercise {
    name:string;
    sets:number;
    reps:number;
    rest:number;
}

interface ExerciseDay{
    day:string;
    focus:string;
    exercises: Exercise[];
}

interface Meal{
    meal_name: string;
    foods: Record<string, number>;
    total_calories: number;
}

interface Predictions {
    target_calories: number;
    protein_ratio : number;
    carb_ratio : number;
    fat_ratio : number;
    exercise_intensity : string;
}

interface FitnessData {
    predictions : Predictions;
    exercise_plan : ExerciseDay[];
    meal_plan : Meal[];
}

const Landing = () => {
    const [formData, setFormData] = useState<UserInput>({
        age : 0,
        weight:0,
        height:0,
        gender : 'male',
        activity_level : 'sedentary',
        goal : 'gain',
    });

    const [fitnessData, setFitnessData] = useState<FitnessData | null>(null);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id] : e.target.value});
    };

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        try{
            const body = JSON.stringify({
    ...formData,
    age: Number(formData.age),
    weight: Number(formData.weight),
    height: Number(formData.height),
});

console.log('Request Body:', body);
            const response = await fetch('https://fitness-backend-iad4.onrender.com/api/fitness-plan', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : body
            
            });


            if(!response.ok) throw new Error("Failed to fetch data")
            const data = await response.json();
            setFitnessData(data);
            
        }catch(e){
            console.log('Error : ', e)
        }


    };


  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-md mt-10'>
        <h1 className='text-3xl font-bold text-center mb-6'>
            Fitness Plan Generator
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor="age" className="block text-lg font-medium">Age:</label>
          <input type="number" id="age" required onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="weight" className="block text-lg font-medium">Weight (kg):</label>
          <input type="number" step="0.1" id="weight" required onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="height" className="block text-lg font-medium">Height (cm):</label>
          <input type="number" id="height" required onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="gender" className="block text-lg font-medium">Gender:</label>
          <select id="gender" required onChange={handleChange} className="w-full p-2 border rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="activity_level" className="block text-lg font-medium">Activity Level:</label>
          <select id="activity_level" required onChange={handleChange} className="w-full p-2 border rounded">
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="very">Very Active</option>
            <option value="extra">Extra Active</option>
          </select>
        </div>
        <div>
          <label htmlFor="goal" className="block text-lg font-medium">Goal:</label>
          <select id="goal" required onChange={handleChange} className="w-full p-2 border rounded">
            <option value="gain">Gain</option>
            <option value="loss">Loss</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">Generate Plan</button>


        </form>

        {fitnessData && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-4">Fitness Plan</h2>
          <div className="space-y-2">
            <p><strong>Target Calories:</strong> {fitnessData.predictions.target_calories} kcal</p>
            <p><strong>Protein Ratio:</strong> {fitnessData.predictions.protein_ratio}%</p>
            <p><strong>Carb Ratio:</strong> {fitnessData.predictions.carb_ratio}%</p>
            <p><strong>Fat Ratio:</strong> {fitnessData.predictions.fat_ratio}%</p>
            <p><strong>Exercise Intensity:</strong> {fitnessData.predictions.exercise_intensity}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Exercise Plan</h3>
            {fitnessData.exercise_plan.map((day, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold">{day.day} - {day.focus}</h4>
                <ul className="list-disc ml-6">
                  {day.exercises.map((exercise, exIdx) => (
                    <li key={exIdx}>{exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Rest: {exercise.rest}s</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Meal Plan</h3>
            {fitnessData.meal_plan.map((meal, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold">{meal.meal_name}</h4>
                <ul className="list-disc ml-6">
                  {Object.entries(meal.foods).map(([food, grams], fIdx) => (
                    <li key={fIdx}>{food} - {grams}g</li>
                  ))}
                </ul>
                <p>Total Calories: {meal.total_calories}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Landing