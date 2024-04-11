'use client'

import { PollsCard } from '@/components/pollsCard';
import { Search } from '@/components/search'
// import { UserCard } from '@/components/usersCard'
import React,{useState,useEffect} from 'react'
import {toast} from 'react-toastify';
// import '../../../firebaseConfig'; // Add this line prevent firebase not loading error
import { getFirestore, addDoc, collection,doc,updateDoc,getDoc,where,getDocs,query } from "firebase/firestore"; 
import firebase_app from '@/firebaseConfig';
// import { set } from 'firebase/database';
import { Loader2 } from 'lucide-react';


const Page = () => {


const data = [
  { id: 1, name: 'John Doe', voters: 0},
  { id: 2, name: 'Jane Doe', votes: 0 },
  { id: 3, name: 'John Smith', votes: 0 }
  //fetch from db
];
let initialData:any = [];
const [teams, setTeams] = useState([]);
const [flag, setFlag] = useState(true);
const [searchText, setSearchText] = useState('');
const [loading, setLoading] = useState(true);


const response = []

// const [voted,setVoted] = useState(false);



const filteredUsers = teams.filter((team:any) => {
  const lowerSearchText = searchText.toLowerCase();
  if(teams.length === 0) return false;
  return (
    
    team.TeamName.toLowerCase().includes(lowerSearchText) 
    // user.Email.toString().includes(lowerSearchText)
  );
});


const db = getFirestore(firebase_app);

const fetchDataFromFirestore = async () => {
  try {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "Teams"));
    console.log("querySnapshot", querySnapshot);
    const temporaryArr:any = [];

    querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
      console.log("doc.data()", doc.data());

    });

    // Filter the fetched data to exclude users with a specific userId
    console.log("temporaryArr", temporaryArr);
    // const filteredUsers = temporaryArr.filter((:any) => user.id !== parseInt(userId));

    // Log filtered users (optional)
    console.log("filteredUsers", temporaryArr);

    // Set the state (users) with filtered data
    setTeams(temporaryArr); // Assuming setUsers is a state update function from React useState hook
    setLoading(false);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    toast.error("Error fetching data from Firestore: " + error);
    setLoading(false);
    // Handle error (e.g., show error message to user)
  }
};

useEffect(() => {
  fetchDataFromFirestore();
}
, []);





  return (<>
  <div className='w-full  h-[15vh] justify-center items-center flex '> 
  {/* {initialData} */}
  <video id="backgroundVideo" autoPlay muted loop className='h-screen w-[100vw] absolute top-0 left-0 object-cover' style={{zIndex: -1}}>
  <source src="/75318-555531864_large.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

  <Search  initialData={initialData} setTeams={setTeams} setSearchText={setSearchText} searchText={searchText}></Search>
  
 
  

  </div>
    <div className='flex flex-col w-full items-center overflow-y-auto h-[85vh]'>
      {
        filteredUsers.sort((a, b) => b.score - a.score) // Sort in descending order based on score
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
