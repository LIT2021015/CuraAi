'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; 

export default function BloodPage() {
      const { data: session } = useSession(); 
  const { id: hospitalId } = useParams() as { id: string };

  const [bloodGroup, setBloodGroup] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [requestBloodGroup, setRequestBloodGroup] = useState('');
  const [requestUnits, setRequestUnits] = useState(1);

  const [donationBloodGroup, setDonationBloodGroup] = useState('');
  const [donationUnits, setDonationUnits] = useState(1);
  const [donorName, setDonorName] = useState('');
  const [donorContact, setDonorContact] = useState('');

  // Search blood stock
  const handleSearch = async () => {
    if (!bloodGroup) {
      toast.error('Please enter a blood group to search');
      return;
    }
    try {
      const res = await axios.get(`/api/hospital/${hospitalId}/blood-stock?group=${bloodGroup}`);
      setSearchResults(res.data.stock || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching blood data');
    }
  };

  // Raise blood request
  const handleRequestBlood = async () => {
    if (!requestBloodGroup || requestUnits < 1) {
      toast.error('Please enter valid blood group and units');
      return;
    }
    try {
      await axios.post('/api/blood-request', {
        hospitalId,
        bloodGroup: requestBloodGroup,
        units: requestUnits,
      });
      toast.success('Blood request raised successfully');
      setRequestBloodGroup('');
      setRequestUnits(1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to raise blood request');
    }
  };

  // Volunteer blood donation
  const handleDonateBlood = async () => {
    if (!donationBloodGroup || !donorName || !donorContact) {
      toast.error('Please fill all donation details');
      return;
    }

    if (!session?.user) {
      toast.error('You must be logged in to register as a donor.');
      return;
    }

    try {
      await axios.post('/api/blood-donation', {
        hospitalId,
        userId: session.user?.id,  
        name: donorName,
        contact: donorContact,
        bloodGroup: donationBloodGroup,
      });
      toast.success('Thank you! You have been registered as a blood donor.');
      setDonationBloodGroup('');
      setDonorName('');
      setDonorContact('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to register as blood donor');
    }
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-red-600">🩸 Blood Services</h1>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted rounded-lg p-1 mb-6 shadow-sm">
          <TabsTrigger value="search" className="data-[state=active]:bg-white data-[state=active]:shadow">
            Search Blood
          </TabsTrigger>
          <TabsTrigger value="request" className="data-[state=active]:bg-white data-[state=active]:shadow">
            Request Blood
          </TabsTrigger>
          <TabsTrigger value="donate" className="data-[state=active]:bg-white data-[state=active]:shadow">
            Volunteer Donation
          </TabsTrigger>
        </TabsList>

        {/* 🔍 Search Blood Tab */}
        <TabsContent value="search">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-500">Search Blood Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    id="bloodGroup"
                    placeholder="e.g. A+, O-, B+"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value.toUpperCase())}
                  />
                  <Button onClick={handleSearch} className="sm:w-fit w-full">
                    Search
                  </Button>
                </div>
              </div>
              {searchResults.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="font-semibold mb-3 text-gray-700">Available Blood Stock:</h3>
                  <ul className="space-y-2">
                    {searchResults.map((stock, idx) => (
                      <li
                        key={idx}
                        className="border p-3 rounded-md shadow-sm flex justify-between items-center bg-white"
                      >
                        <span className="font-medium">{stock.bloodGroup}</span>
                        <span className="text-sm text-gray-600">{stock.quantity} units</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                bloodGroup !== '' && (
                  <p className="text-center text-red-500 mt-4 font-semibold">
                    No blood stock found for blood group "{bloodGroup}" in this hospital.
                  </p>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🩸 Request Blood Tab */}
        <TabsContent value="request">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-yellow-600">Raise Blood Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="requestBloodGroup">Blood Group</Label>
                <Input
                  id="requestBloodGroup"
                  placeholder="e.g. A+, O-, AB-"
                  value={requestBloodGroup}
                  onChange={(e) => setRequestBloodGroup(e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestUnits">Units Needed</Label>
                <Input
                  type="number"
                  id="requestUnits"
                  min={1}
                  value={requestUnits}
                  onChange={(e) => setRequestUnits(Number(e.target.value))}
                />
              </div>
              <Button onClick={handleRequestBlood} variant="outline" className="w-full sm:w-auto">
                Request Blood
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

       {/* 🩸 Become a Donor */}
       <TabsContent value="donate">
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-green-600">Become a Blood Donor</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="donorName">Full Name</Label>
        <Input
          id="donorName"
          placeholder="Enter your full name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="donorContact">Contact (Phone or Email)</Label>
        <Input
          id="donorContact"
          placeholder="Enter your phone or email"
          value={donorContact}
          onChange={(e) => setDonorContact(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="donationBloodGroup">Blood Group</Label>
        <Input
          id="donationBloodGroup"
          placeholder="e.g. A+, O-, B+"
          value={donationBloodGroup}
          onChange={(e) => setDonationBloodGroup(e.target.value.toUpperCase())}
        />
      </div>

      <Button onClick={handleDonateBlood} className="w-full mt-4">
        Register as Donor
      </Button>
    </CardContent>
  </Card>
</TabsContent>
      </Tabs>
    </div>
  );
}
