'use client'
import React from 'react'
import { signIn } from "next-auth/react";
import { Button } from './ui/button';
import { toast } from "@/components/ui/use-toast";

type Props = {}

const SingInButton = (props: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const loginWithGoogle  = async () => {
        setIsLoading(true)
        try {
            await signIn("google");
        } catch (error) {
            toast({
                title: "There was a problem",
                description: "There was an error logging in with Google.",
                variant: "destructive",
              });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button variant="ghost" onClick={loginWithGoogle }>
            Sign In
        </Button>
    )
}

export default SingInButton