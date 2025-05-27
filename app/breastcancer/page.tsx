"use client"
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackgroundGradient } from '@/components/ui/background-gradient';


const page = () => {
    const [formData, setFormData] = useState({
        firstname :'',
        lastname: '',
        phone : '',
        email : '',
        gender : '',
        age : '',
        concave_points_mean: '',
        area_mean: '',
        radius_mean: '',
        perimeter_mean: '',
        concavity_mean: '',
    });

    const [result, setResult] = useState<null | number>(null);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    const handleSelect = (value : string) => {
        setFormData({...formData, gender: value})
    }

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await fetch('/api/breast-cancer', {
                method : 'POST',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify(formData),
            });
            const data = await res.json();
            setResult(data.prediction)
        }catch(err)
        {
            console.log('Prediction Error : ', err)
        }
    };

  return (
    <div className="min-h-screen  py-18 px-4 flex flex-col items-center">
      <BackgroundGradient
                 
                  className="rounded-[22px] p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
      <Card className="w-full max-w-4xl shadow-2xl border-2 border-pink-300">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Breast Cancer Detection</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input name="firstname" value={formData.firstname} onChange={handleChange} required />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input name="lastname" value={formData.lastname} onChange={handleChange} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label>Gender</Label>
              <Select onValueChange={handleSelect} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Age</Label>
              <Input name="age" type="number" value={formData.age} onChange={handleChange} required />
            </div>
            <div>
              <Label>Concave Points Mean</Label>
              <Input name="concave_points_mean" type="number" step="any" value={formData.concave_points_mean} onChange={handleChange} required />
            </div>
            <div>
              <Label>Area Mean</Label>
              <Input name="area_mean" type="number" step="any" value={formData.area_mean} onChange={handleChange} required />
            </div>
            <div>
              <Label>Radius Mean</Label>
              <Input name="radius_mean" type="number" step="any" value={formData.radius_mean} onChange={handleChange} required />
            </div>
            <div>
              <Label>Perimeter Mean</Label>
              <Input name="perimeter_mean" type="number" step="any" value={formData.perimeter_mean} onChange={handleChange} required />
            </div>
            <div>
              <Label>Concavity Mean</Label>
              <Input name="concavity_mean" type="number" step="any" value={formData.concavity_mean} onChange={handleChange} required />
            </div>

            <div className="col-span-full flex justify-center mt-6">
              <Button type="submit" className="px-8 py-2 text-lg bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md">
                Submit
              </Button>
            </div>
          </form>

          {result !== null && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-semibold">Prediction Result:</h2>
              <p className={`text-xl mt-2 ${result === 1 ? 'text-red-600' : 'text-green-600'}`}>
                {result === 1 ? 'MALIGNANT' : 'BENIGN'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </BackgroundGradient>
    </div>
  )
}

export default page