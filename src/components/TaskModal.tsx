import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import React,{useEffect} from 'react'
import { MemberCard } from "./MemberCard"
import firebase_app from "../firebaseConfig";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from 'react-toastify';

const TaskModal = (props:any) => {
    const {open,setOpen,team}=props
    console.log("team_L",team)
    const [loading, setLoading] = React.useState(true);
    const [players, setPlayers] = React.useState([]);

    const fetchPlayersByTeamName = async (teamName:any) => {
      const db = getFirestore(firebase_app);
      try {
        setLoading(true);
  
        // Query Firestore to get the team document based on TeamName
        const teamQuerySnapshot = await getDocs(query(collection(db, "Teams"), where("TeamName", "==", teamName)));
  
        if (!teamQuerySnapshot.empty) {
          // There should be exactly one document with the specified teamName
          const teamDoc = teamQuerySnapshot.docs[0];
  
          // Query the "players" subcollection of the team document
          const playersQuerySnapshot = await getDocs(collection(teamDoc.ref, "players"));
  
          const fetchedPlayers = [];
  
          // Iterate through the players subcollection to extract player data
          playersQuerySnapshot.forEach((playerDoc) => {
            const playerData = playerDoc.data();
            fetchedPlayers.push(playerData);
          });
  
          // Update the players state with the fetched players array
          setPlayers(fetchedPlayers);
          // toast.success(`Players in team ${teamName} fetched successfully.`);
        } else {
          console.log(`Team with name ${teamName} not found.`);
          toast.error(`Team with name ${teamName} not found.`);
        }
  
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching players for team ${teamName} from Firestore:`, error);
        toast.error(`Error fetching players for team ${teamName} from Firestore: ${error}`);
        setLoading(false);
      }
    };
    useEffect(()=>{
      if(team){
        fetchPlayersByTeamName(team.TeamName)
      }
    
    },[team])
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
  {/* <DialogTrigger >Open</DialogTrigger> */}
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="mb-[20px]"> Alive Team Members</DialogTitle>
      <DialogDescription className="overflow-y-auto">
       {!loading && <>
        {players.length>0?players.map((player:any)=>{
        return <MemberCard key={player.email} player={player}/>
      }
      ):<p className=" w-[100%] text-center">No Members Alive</p>}
       
       </>}
        {loading && <p className=" w-[100%] text-center">Loading...</p>}


        {/* <p className=" w-[100%] text-center">No Members Alive</p> */}
     
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

      
    </div>
  )
}

export default TaskModal
  