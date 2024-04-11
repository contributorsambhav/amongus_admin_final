import { BellRing, Check } from "lucide-react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
import React, { useState } from "react"
import firebase_app from "@/firebaseConfig"; // Add this line prevent firebase not loading error
import { getFirestore, addDoc, collection,doc,updateDoc,getDoc,where,getDocs,query,FieldValue } from "firebase/firestore"; 
import { set } from 'firebase/database';
import {toast} from 'react-toastify';
import TaskModal from "./TaskModal"
import { ScoreCard } from "./ScoreCard";



type CardProps = React.ComponentProps<typeof Card>

export function PollsCard({ className, ...props }: any) {
  const {team,index,fetchDataFromFirestore} = props;
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const [open, setOpen] = useState(false);
const [scoreModal, setScoreModal] = useState(false);

const increaseTeamScore = async (teamName: string, taskId: string,scoreinc:string) => {
  try {
    setLoading(true);
    console.log("teamName",teamName);
    console.log("taskId",taskId);
    const db = getFirestore(firebase_app);
    const teamsRef : any = collection(db, 'Teams'); 
    console.log("teamsRef",teamsRef);
    // Reference to the Teams collection

    // Create a query to find the team by TeamName
    const query2 = query(teamsRef, where('TeamName', '==', teamName));


    // Use getDocs to fetch matching documents (expecting at most one)
    const querySnapshot:any = await getDocs(query2);
    console.log("querySnapshot",querySnapshot);

    if (querySnapshot.size === 1) {
   
      const docRef = querySnapshot.docs[0].ref;
      const currentScore = querySnapshot.docs[0].data().score || 0; // Get current votes or default to 0
      const currentTasks = querySnapshot.docs[0].data().tasks || []; // Get current votes or default to []
      const newScore = parseInt(currentScore) + parseInt(scoreinc);
      // currentTasks.push(taskId);
      if (!currentTasks.includes(taskId)) {
        // taskId is not already in the array, so we can push it
        currentTasks.push(taskId);
      
        // Update Firestore document with the new tasks array and updated score
        await updateDoc(querySnapshot.docs[0].ref, {
          tasks: currentTasks,
          score: newScore
        });
      
        console.log(`Task ${taskId} added successfully.`);
        toast.success(`Team score for ${teamName} increased by ${scoreinc} for Task ID: ${taskId}`);
         
      fetchDataFromFirestore();
        
      } else {
        console.log(`Task ${taskId} already exists in the tasks array.`);
        toast.error(`Task ${taskId} already exists in the tasks array.`);
      }
      
      // Get the first document

      // Update score and push task ID atomically
      // await updateDoc(docRef, { score: newScore, tasks: currentTasks});

      // console.log(`Team score for ${teamName} increased by ${scoreinc} for Task ID: ${taskId}`);
      setLoading(false);
    
    } else {
      console.error(`Team not found with name: ${teamName}`);
      toast.error(`Team not found with name: ${teamName}`);
      setLoading(false);
    }
  } catch (error) {
    console.error('Error updating team score:', error);
    toast.error('Error updating team score');
    setLoading(false);
    // Handle error (e.g., show error message to user)
  }
};









  return (
    <Card className={cn("w-[80vw] mb-[20px]", className)} {...props}>
      <CardHeader>
        <CardTitle>#{index+1} <span className={team.isAlive?"":"line-through"}>{team.TeamName}</span><span className="text-[red] ml-[7px]">{!team.isAlive?"Eliminated":""}</span></CardTitle>
        <CardDescription>Score : {team.score} || Tasks Completed : {team.tasks.length}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
          <Switch />
        </div> */}
        <div>

        

            <Button className="me-[15px]" onClick={()=>{
              setOpen(true);
            }} >
              View Details
            </Button>
            <Button  onClick={()=>{
              setScoreModal(true);
            }}>
              Add Score
            </Button>

            <TaskModal open={open} setOpen={setOpen}></TaskModal>

            <ScoreCard scoreModal={scoreModal} setScoreModal={setScoreModal}></ScoreCard>

            <TaskModal open={open} setOpen={setOpen} team={team}></TaskModal>

            <ScoreCard scoreModal={scoreModal} setScoreModal={setScoreModal} increaseTeamScore={increaseTeamScore} team={team}></ScoreCard>
          
          
          
          
          
        
        
       

        </div>
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter> */}
    </Card>
  )
}
