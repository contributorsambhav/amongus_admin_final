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
import '../firebaseConfig'; // Add this line prevent firebase not loading error
import { getFirestore, addDoc, collection,doc,updateDoc,getDoc,where,getDocs,query } from "firebase/firestore"; 
import { set } from 'firebase/database';
import {toast} from 'react-toastify';
import TaskModal from "./TaskModal"

const notifications:any= [
 
]

type CardProps = React.ComponentProps<typeof Card>

export function MemberCard({ className, ...props }: any) {
  const {player}=props;




  //firebase write function


  return (
    <Card className={cn("w-[100%] mb-[20px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
        <CardDescription>email : {player.email}</CardDescription>
      </CardHeader>
    </Card>
  )
}
