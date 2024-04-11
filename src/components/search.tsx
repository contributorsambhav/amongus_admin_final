'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import firebase_app from '@/firebaseConfig';
import { getFirestore, addDoc, collection,doc,updateDoc,getDoc,where,getDocs,query,FieldValue } from "firebase/firestore"; 
import {toast} from 'react-toastify';
import { set } from 'firebase/database';


export function Search({ setTeams,setSearchText,searchText}: any) {
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);



  const togglePolling = async () => {
    console.log("togglePolling");
    setVoteLoading(true);
    const db = getFirestore();
    const gameStatusDocRef = doc(db, 'GameStatus', 'Status'); // Replace 'YOUR_DOCUMENT_ID' with the actual document ID
  
    try {
      const gameStatusDocSnap = await getDoc(gameStatusDocRef);
  
      if (gameStatusDocSnap.exists()) {
        const currentStatus = gameStatusDocSnap.data().voting;
        console.log(gameStatusDocSnap.data())
        console.log("currentStatus",currentStatus);
        const updatedStatus = !currentStatus; // Toggle the Status field
        console.log("updatedStatus",updatedStatus);
  
        // Update the Status field in Firestore document
        await updateDoc(gameStatusDocRef, { voting: updatedStatus });
  
        // Display success toast message
        const action = updatedStatus ? 'started' : 'ended';
        if(action === 'started'){
          setFlag(true);
        }
        else{
          setFlag(false);
        }
        if (updatedStatus) {
          toast.success(`Polling ${action}`, { autoClose: 3000 });
        }
        else{
          toast.error(`Polling ${action}`, { autoClose: 3000 });
        }
      
        setVoteLoading(false);
         // Notify polling started or ended
      } else {
        setVoteLoading(false);
        toast.error('GameStatus document does not exist.');
        console.log('GameStatus document does not exist.');
       
      }
    } catch (error) {
      console.error('Error toggling polling:', error);
      toast.error('Failed to toggle polling');
      setVoteLoading(false);
       // Show error message using toast.error
    }
  };





  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value); // Update searchText state with input value
  };

  const resetPlayerVotes = async () => {
    try {
      setLoading(true); // Assuming setLoading is a state setter function
      const db = getFirestore();
  
      // Reference to the AllPlayers collection
      const playersRef = collection(db, 'AllPlayers');
  
      // Fetch all players
      const playersSnapshot = await getDocs(playersRef);
  
      // Iterate through each player document
      playersSnapshot.forEach(async (playerDoc) => {
        const playerId = playerDoc.id;
        const playerRef = doc(db, 'AllPlayers', playerId);
  
        // Resetting votes to 0 for each player
        await updateDoc(playerRef, { votes: 0 });
  
        // console.log(`Votes reset successfully for player with ID: ${playerId}`);
      
      });
  
      toast.success(`Votes reset successfull`);
      // Optionally perform any additional actions after resetting votes
      // fetchDataFromFirestore(); // Example: Fetch updated data after resetting votes
  
      setLoading(false);
    } catch (error) {
      console.error('Error resetting player votes:', error);
      toast.error('Error resetting player votes');
      setLoading(false);
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className="flex w-[80vw] space-x-2 items-center justify-center">
      <Input
        className="w-[70%]"
        type="text"
        placeholder="Search here ..."
        value={searchText}
        onChange={handleInputChange}
      />
     <Button
  
  onClick={()=>{
    confirm("Are you sure you want to toggle voting?") &&
    togglePolling()
    
  }}
  disabled={voteLoading} // Disable the button when loading is true
  style={{ backgroundColor: voteLoading ? 'grey' : "green" }} // Set grey background when loading
>  {!voteLoading &&<>
  {flag ? 'Stop Voting' : 'Start Voting'}

</> }
{voteLoading && 'Loading...'}
  
</Button>

     <Button
  variant='destructive'
  onClick={()=>{
    window.confirm("Are you sure you want to reset votes?") &&
    resetPlayerVotes()
    
  }}
  disabled={loading} // Disable the button when loading is true
  style={{ backgroundColor: loading ? '#ccc' : undefined }} // Set grey background when loading
>
  {loading ? 'Resetting...' : 'Reset Votes'}
</Button>
     
    </div>
  );
}

