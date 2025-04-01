'use client'
import { PollsCard } from '@/components/pollsCard';
import { Search } from '@/components/search'
import React,{useState,useEffect} from 'react'
import {toast} from 'react-toastify';
import { getFirestore, addDoc, collection,doc,updateDoc,getDoc,where,getDocs,query } from "firebase/firestore"; 
import firebase_app from '@/firebaseConfig';
import { Loader2 } from 'lucide-react';
const Page = () => {
const data = [
  { id: 1, name: 'John Doe', voters: 0},
  { id: 2, name: 'Jane Doe', votes: 0 },
  { id: 3, name: 'John Smith', votes: 0 }
];
let initialData:any = [];
const [teams, setTeams] = useState([]);
const [flag, setFlag] = useState(true);
const [searchText, setSearchText] = useState('');
const [loading, setLoading] = useState(true);
const response = []
const filteredUsers = teams.filter((team:any) => {
  const lowerSearchText = searchText.toLowerCase();
  if(teams.length === 0) return false;
  return (
    team.TeamName?.toLowerCase().includes(lowerSearchText) 
  );
});
const db = getFirestore(firebase_app);
const fetchDataFromFirestore = async () => {
  try {
    setLoading(true);
    const teamsCollectionRef = collection(db, "Teams");
    const teamsQuerySnapshot = await getDocs(teamsCollectionRef);
    const filteredTeams = [];
    for (const teamDoc of teamsQuerySnapshot.docs) {
      const teamData = teamDoc.data();
      const teamId = teamDoc.id;
      const playersCollectionRef = collection(db, "Teams", teamId, "players");
      const playersQuerySnapshot:any = await getDocs(playersCollectionRef);
      if (playersQuerySnapshot.size > 1) {
        filteredTeams.push({ ...teamData, id: teamId }); 
      }
    }
    setTeams(filteredTeams); 
    setLoading(false);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    toast.error("Error fetching data from Firestore: " + error.message);
    setLoading(false);
  }
};
useEffect(() => {
  fetchDataFromFirestore();
}
, []);
  return (<>
  <div className='w-full  h-[15vh] justify-center items-center flex '> 
  {}
  <video id="backgroundVideo" autoPlay muted loop className='h-screen w-[100vw] absolute top-0 left-0 object-cover' style={{zIndex: -1}}>
  <source src="/75318-555531864_large.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>
  <Search  initialData={initialData} setTeams={setTeams} setSearchText={setSearchText} searchText={searchText}></Search>
  </div>
    <div className='flex flex-col w-full items-center overflow-y-auto h-[85vh]'>
      {
        filteredUsers.sort((a, b) => b.score - a.score) 
        .map((team, index) => (
          <PollsCard key={team.id} team={team} index={index} fetchDataFromFirestore={fetchDataFromFirestore} />
        ))
      }
      {!loading && teams.length === 0 && (
        <p className='text-white'>No data found</p>
      )}
      {loading && (
        <>
          <Loader2 className="h-8 w-8 mb-3 animate-spin text-white" />
          <p className='text-white'>Loading...</p>
        </>
        )}
    </div>
    </>)
}
export default Page